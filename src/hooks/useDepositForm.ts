import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { generatePixDeposit, processCreditCardDeposit, checkPixStatus } from '../lib/transactions';
import { useUTMTracking } from './useUTMTracking';

// Declaração de tipos para UTMify
declare global {
  interface Window {
    pixel?: {
      track: (eventName: string, data?: any) => void;
    };
  }
}

// Define tipos para melhorar a tipagem
export interface CardFormData {
  amount: number;
  holderName: string;
  cpf: string;
  number: string;
  expirationDate: string;
  cvv: string;
}

export interface PixData {
  qr_code: string;
  external_id: string;
  [key: string]: any;
}

// Hook personalizado para gerenciar o estado do formulário de depósito
export const useDepositForm = (onDepositSuccess: () => void, user: any) => {
  // Hook para tracking UTM
  const { getTrackingData } = useUTMTracking();
  
  // Estados para controle do fluxo de depósito
  const [depositStep, setDepositStep] = useState<string>('select-method'); // select-method, pix-amount, pix-qrcode, card-amount, card-user, card-details
  const [depositMethod, setDepositMethod] = useState<string | null>(null); // 'pix' ou 'card'
  const [depositAmount, setDepositAmount] = useState<number>(50);
  
  // Estados para depósito via PIX
  const [isGeneratingPix, setIsGeneratingPix] = useState<boolean>(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const statusCheckInterval = useRef<number | null>(null);
  
  // Estados para depósito via cartão
  const [cardForm, setCardForm] = useState<CardFormData>({
    amount: 50,
    holderName: '',
    cpf: '',
    number: '',
    expirationDate: '',
    cvv: ''
  });
  const [isProcessingCard, setIsProcessingCard] = useState<boolean>(false);

  // Limpar intervalos e estados quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);
  
  // Resetar o formulário quando o modal é fechado
  const resetForm = () => {
    // Limpar intervalos
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = null;
    }

    // Resetar estado do depósito
    setDepositStep('select-method');
    setDepositMethod(null);
    setDepositAmount(50);
    setPixData(null);
    setQrCodeImage('');
    setPaymentStatus(null);
    setCardForm({
      amount: 50,
      holderName: '',
      cpf: '',
      number: '',
      expirationDate: '',
      cvv: ''
    });
  };

  // Selecionar método de depósito
  const handleDepositMethodSelect = (method: string) => {
    if (method === 'card' && (!user.balance || user.balance === 0)) {
      toast.error('Cartão de crédito disponível apenas após primeiro depósito via PIX');
      return;
    }

    setDepositMethod(method);
    setDepositStep(method === 'pix' ? 'pix-amount' : 'card-amount');
  };

  // Gerar código PIX
  const handleGeneratePix = async () => {
    if (isGeneratingPix) return;
    
    if (depositAmount < 25) {
      toast.error('O valor mínimo para depósito é R$ 25,00');
      return;
    }
    
    setIsGeneratingPix(true);

    try {
      // Obter dados de tracking UTM
      const trackingData = getTrackingData();
      console.log('Enviando tracking data com PIX:', trackingData);

      // Gerar PIX com parâmetros de tracking
      const response = await generatePixDeposit(depositAmount, trackingData);
      
      // Verificar se a resposta tem o formato esperado
      if (response) {
        // Handle caso a resposta seja diretamente o objeto de dados
        if (response.qr_code && response.external_id) {
          // A resposta já é o objeto de dados
          setPixData(response);
          
          try {
            const qrImage = await QRCode.toDataURL(response.qr_code);
            setQrCodeImage(qrImage);
          } catch (qrError) {
            console.error('Error generating QR code:', qrError);
            // Continua mesmo se o QR falhar
          }
          
          setDepositStep('pix-qrcode');
          startStatusCheck(response.external_id);

          // Marcar evento no UTMify - PIX Gerado
          try {
            if (window.pixel) {
              window.pixel.track('InitiateCheckout', {
                value: depositAmount,
                currency: 'BRL',
                content_type: 'pix_deposit'
              });
              console.log('Evento InitiateCheckout enviado para UTMify');
            }
          } catch (utmifyError) {
            console.error('Erro ao enviar evento para UTMify:', utmifyError);
          }
          
          return;
        }
        
        // Handle caso a resposta esteja no formato {success: true, data: {...}}
        if (response.success && response.data) {
          setPixData(response.data);
          
          if (response.data.qr_code) {
            try {
              const qrImage = await QRCode.toDataURL(response.data.qr_code);
              setQrCodeImage(qrImage);
            } catch (qrError) {
              console.error('Error generating QR code:', qrError);
              // Continua mesmo se o QR falhar
            }
          }
          
          setDepositStep('pix-qrcode');
          
          if (response.data.external_id) {
            startStatusCheck(response.data.external_id);
          }

          // Marcar evento no UTMify - PIX Gerado
          try {
            if (window.pixel) {
              window.pixel.track('InitiateCheckout', {
                value: depositAmount,
                currency: 'BRL',
                content_type: 'pix_deposit'
              });
              console.log('Evento InitiateCheckout enviado para UTMify');
            }
          } catch (utmifyError) {
            console.error('Erro ao enviar evento para UTMify:', utmifyError);
          }
          
          return;
        }
      }
      
      // Se chegou aqui, é um formato de resposta não reconhecido
      throw new Error('Formato de resposta inválido');
      
    } catch (error: any) {
      console.error('Error generating PIX:', error);
      toast.error(error?.message || 'Erro ao gerar PIX');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  // Iniciar verificação de status do pagamento PIX
  const startStatusCheck = (externalId: string) => {
    // Limpar qualquer intervalo existente
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }

    setIsCheckingStatus(true);
    
    // Verificar imediatamente uma vez
    checkPaymentStatus(externalId);
    
    // Definir intervalo para verificar a cada 5 segundos
    statusCheckInterval.current = window.setInterval(() => {
      checkPaymentStatus(externalId);
    }, 5000);
  };

  // Verificar status do pagamento PIX
  const checkPaymentStatus = async (externalId: string) => {
    try {
      const response = await checkPixStatus(externalId);
      
      // Verificar estrutura da resposta
      let statusData = null;
      
      if (response && response.status) {
        // Resposta direta sem wrapper
        statusData = response;
      } else if (response && response.success && response.data) {
        // Resposta com wrapper {success, data}
        statusData = response.data;
      } else {
        console.warn('Formato de resposta de status inválido:', response);
        return;
      }
      
      // Atualiza o estado com o status atual do pagamento
      setPaymentStatus(statusData.status);
      
      if (statusData.status === 'COMPLETED') {
        // Payment completed
        toast.success('Pagamento confirmado! Seu saldo foi atualizado.');
        
        // Limpar intervalo
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        
        setIsCheckingStatus(false);
        
        // Notificar sucesso
        onDepositSuccess();
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else if (statusData.status === 'FAILED') {
        // Payment failed
        toast.error('Pagamento falhou. Por favor, tente novamente.');
        
        // Limpar intervalo
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        
        setIsCheckingStatus(false);
      }
      // Se o status for PENDING, continuamos aguardando
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Não interrompemos o intervalo em caso de erro de rede temporário
      // Continuamos tentando na próxima iteração
    }
  };

  // Funções de formatação para campos do cartão
  const formatCardNumber = (value: string): string => {
    // Remove todos os não-dígitos
    const digits = value.replace(/\D/g, '');
    
    // Formata com espaços a cada 4 dígitos
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limita a 19 caracteres (16 dígitos + 3 espaços)
    return formatted.slice(0, 19);
  };

  const formatExpirationDate = (value: string): string => {
    // Remove todos os não-dígitos
    const digits = value.replace(/\D/g, '');
    
    // Formata como MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      return digits;
    }
  };

  const formatCPF = (value: string): string => {
    // Remove todos os não-dígitos
    const digits = value.replace(/\D/g, '');
    
    // Formata como xxx.xxx.xxx-xx
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
  };

  // Handler para alteração de campo do cartão
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      setCardForm({
        ...cardForm,
        [name]: formatCardNumber(value)
      });
    } else if (name === 'expirationDate') {
      setCardForm({
        ...cardForm,
        [name]: formatExpirationDate(value)
      });
    } else if (name === 'cpf') {
      setCardForm({
        ...cardForm,
        [name]: formatCPF(value)
      });
    } else {
      setCardForm({
        ...cardForm,
        [name]: value
      });
    }
  };

  // Processar pagamento com cartão
  const handleCardSubmit = async () => {
    if (isProcessingCard) return;

    // Validação
    const cardNumber = cardForm.number.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      toast.error('Número do cartão inválido');
      return;
    }

    const expDate = cardForm.expirationDate;
    if (!expDate.includes('/') || expDate.length !== 5) {
      toast.error('Data de validade inválida');
      return;
    }

    const [expMonth, expYear] = expDate.split('/');
    if (parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
      toast.error('Mês de validade inválido');
      return;
    }

    const currentYear = new Date().getFullYear() % 100; // Pegar os últimos 2 dígitos
    if (parseInt(expYear) < currentYear) {
      toast.error('Cartão expirado');
      return;
    }

    if (cardForm.cvv.length < 3) {
      toast.error('CVV inválido');
      return;
    }

    if (!cardForm.holderName || cardForm.holderName.length < 3) {
      toast.error('Nome do titular inválido');
      return;
    }

    if (cardForm.cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return;
    }

    setIsProcessingCard(true);

    try {
      // Preparar dados no formato esperado pela API
      const cardData = {
        amount: cardForm.amount,
        cardNumber: cardNumber,
        holderName: cardForm.holderName,
        expirationDate: cardForm.expirationDate,
        cvv: cardForm.cvv,
        cpf: cardForm.cpf.replace(/\D/g, '')
      };

      // Chamar API
      const response = await processCreditCardDeposit(cardData);

      // Verificar resposta - pode vir em diferentes formatos
      let isSuccess = false;
      
      if (response && response.success) {
        // Formato {success: true, ...}
        isSuccess = true;
      } else if (response && response.transaction_id) {
        // Formato onde a resposta direta é sucesso
        isSuccess = true;
      } else if (response && response.status === 'COMPLETED') {
        // Formato onde a resposta tem um status
        isSuccess = true;
      }

      if (isSuccess) {
        toast.success('Depósito realizado com sucesso!');

        // Marcar evento de Purchase no UTMify para cartão
       
        
        // Notificar sucesso
        onDepositSuccess();
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        // Tentar extrair mensagem de erro
        const errorMessage = 
          response?.message || 
          response?.error?.message || 
          'Falha ao processar pagamento';
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error processing card:', error);
      toast.error(error?.message || 'Erro ao processar cartão');
    } finally {
      setIsProcessingCard(false);
    }
  };

  return {
    depositStep,
    setDepositStep,
    depositMethod,
    depositAmount,
    setDepositAmount,
    pixData,
    qrCodeImage,
    isGeneratingPix,
    isCheckingStatus,
    paymentStatus,
    cardForm,
    setCardForm,
    isProcessingCard,
    resetForm,
    handleDepositMethodSelect,
    handleGeneratePix,
    handleCardInputChange,
    handleCardSubmit,
  };
};