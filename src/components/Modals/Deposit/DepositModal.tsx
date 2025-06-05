import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDepositForm } from '../../../hooks/useDepositForm';

// Importar componentes
import MethodSelection from './MethodSelection';
import PixAmountStep from './PixAmountStep';
import PixQRCodeStep from './PixQRCodeStep';
import CardAmountStep from './CardAmountStep';
import CardUserStep from './CardUserStep';
import CardDetailsStep from './CardDetailsStep';
import ModalHeader from './ModalHeader';

interface DepositModalProps {
  user: any;
  setUser: (user: any) => void;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ user, setUser, onClose }) => {
  // Função para atualizar o perfil do usuário após depósito bem-sucedido
  const updateUserProfile = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch("https://money2025-api01peak.krkzfx.easypanel.host/api/auth/profile", {
=======
      const response = await fetch("https://money2025-apipeak05.krkzfx.easypanel.host/api/auth/profile", {
>>>>>>> 12c210f78b0630f30c0de60afee78885a0eda53b
        headers: {
          "accept": "application/json, text/plain, */*",
          "authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        method: "GET",
      });
      
      const data = await response.json();
      
      if (data.success && data.data && setUser && user) {
        setUser({
          ...user,
          balance: data.data.balance
        });
      }
    } catch (error) {
      console.error('Error updating profile after payment:', error);
    }
  };

  // Usar o hook personalizado para gerenciar o estado do formulário
  const {
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
  } = useDepositForm(updateUserProfile, user);

  // Efeito para atualizar a interface quando o modal de depósito é fechado
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0F1C2E] rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-auto"
      >
        {/* Header with title and close button */}
        <ModalHeader 
          step={depositStep}
          onBack={() => {
            if (depositStep === 'pix-amount' || depositStep === 'card-amount') {
              setDepositStep('select-method');
            } else if (depositStep === 'pix-qrcode') {
              setDepositStep('pix-amount');
            } else if (depositStep === 'card-user') {
              setDepositStep('card-amount');
            } else if (depositStep === 'card-details') {
              setDepositStep('card-user');
            }
          }}
          onClose={onClose}
        />
        
        {/* Method Selection Step */}
        {depositStep === 'select-method' && (
          <MethodSelection 
            user={user}
            onMethodSelect={handleDepositMethodSelect}
          />
        )}
        
        {/* PIX Amount Step */}
        {depositStep === 'pix-amount' && (
          <PixAmountStep 
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            isGeneratingPix={isGeneratingPix}
            onGeneratePix={handleGeneratePix}
          />
        )}
        
        {/* PIX QR Code Step */}
        {depositStep === 'pix-qrcode' && (
          <PixQRCodeStep 
            pixData={pixData}
            qrCodeImage={qrCodeImage}
            isCheckingStatus={isCheckingStatus}
            paymentStatus={paymentStatus}
          />
        )}
        
        {/* Card Amount Step */}
        {depositStep === 'card-amount' && (
          <CardAmountStep 
            cardForm={cardForm}
            setCardForm={setCardForm}
            onContinue={() => setDepositStep('card-user')}
          />
        )}
        
        {/* Card User Data Step */}
        {depositStep === 'card-user' && (
          <CardUserStep 
            cardForm={cardForm}
            handleCardInputChange={handleCardInputChange}
            onContinue={() => setDepositStep('card-details')}
          />
        )}
        
        {/* Card Details Step */}
        {depositStep === 'card-details' && (
          <CardDetailsStep 
            cardForm={cardForm}
            handleCardInputChange={handleCardInputChange}
            isProcessingCard={isProcessingCard}
            onSubmit={handleCardSubmit}
          />
        )}
      </motion.div>
    </div>
  );
};

export default DepositModal;