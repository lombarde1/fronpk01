import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  ArrowDownCircle, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ArrowRightCircle,
  RefreshCw,
  Clock,
  Info,
  Mail,
  Phone,
  CreditCard,
  KeyRound,
  HelpCircle
} from 'lucide-react';
import { requestWithdrawal } from  '../../lib/transactions';
import toast from 'react-hot-toast';

interface WithdrawModalProps {
  user: {
    balance: number;
    _id?: string;
    id?: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ user, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [pixKeyType, setPixKeyType] = useState<string>('cpf');
  const [pixKey, setPixKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const MIN_WITHDRAWAL = 50;
  const MAX_WITHDRAWAL = 5000;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAmount('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAmount(numValue);
    }
  };

  const validateForm = (): boolean => {
    // Verificar valor mínimo e máximo
    if (!amount || amount < MIN_WITHDRAWAL) {
      toast.error(`O valor mínimo para saque é ${formatCurrency(MIN_WITHDRAWAL)}`);
      return false;
    }

    if (amount > MAX_WITHDRAWAL) {
      toast.error(`O valor máximo para saque é ${formatCurrency(MAX_WITHDRAWAL)}`);
      return false;
    }

    // Verificar se tem saldo suficiente
    if (amount > user.balance) {
      toast.error('Saldo insuficiente para este saque');
      return false;
    }

    // Verificar chave PIX
    if (!pixKey.trim()) {
      toast.error('Por favor, informe sua chave PIX');
      return false;
    }

    // Validações específicas por tipo de chave
    if (pixKeyType === 'cpf' && !/^\d{11}$/.test(pixKey.replace(/\D/g, ''))) {
      toast.error('CPF inválido. Informe apenas os 11 números');
      return false;
    }

    if (pixKeyType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
      toast.error('E-mail inválido');
      return false;
    }

    if (pixKeyType === 'phone' && !/^\d{10,11}$/.test(pixKey.replace(/\D/g, ''))) {
      toast.error('Telefone inválido. Informe DDD + número');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Formatando os dados conforme a API espera
      const withdrawalData = {
        amount: Number(amount),

          pixKey,
          pixKeyType,
  
        paymentMethod: 'PIX'
      };
      
      const response = await requestWithdrawal(withdrawalData);
      
      if (response.success) {
        setTransaction(response.transaction);
        setStep(2); // Avançar para a tela de confirmação
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.message || 'Erro ao processar o saque');
      }
    } catch (err: any) {
      console.error('Erro ao solicitar saque:', err);
      setError(err.message || 'Erro ao processar o saque. Tente novamente.');
      toast.error(err.message || 'Erro ao processar o saque');
    } finally {
      setLoading(false);
    }
  };

  const getPixKeyTypePlaceholder = () => {
    switch (pixKeyType) {
      case 'cpf': return '123.456.789-10';
      case 'email': return 'email@exemplo.com';
      case 'phone': return '(11) 98765-4321';
      case 'random': return 'Chave aleatória';
      default: return 'Digite sua chave PIX';
    }
  };

  const getPixKeyTypeIcon = () => {
    switch (pixKeyType) {
      case 'cpf': return <CreditCard className="text-slate-400" size={20} />;
      case 'email': return <Mail className="text-slate-400" size={20} />;
      case 'phone': return <Phone className="text-slate-400" size={20} />;
      case 'random': return <KeyRound className="text-slate-400" size={20} />;
      default: return <HelpCircle className="text-slate-400" size={20} />;
    }
  };

  const renderStepOne = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-300 text-sm">Saldo disponível</h3>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg">
            <Wallet size={16} className="text-amber-500" />
            <span className="text-amber-500 font-bold">{formatCurrency(user?.balance || 0)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <ArrowDownCircle size={14} />
            Valor do saque
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
            <input
              type="number"
              min={MIN_WITHDRAWAL}
              max={Math.min(user?.balance || 0, MAX_WITHDRAWAL)}
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-slate-500">Min: {formatCurrency(MIN_WITHDRAWAL)}</span>
            <span className="text-slate-500">Max: {formatCurrency(MAX_WITHDRAWAL)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <KeyRound size={14} />
              Tipo de chave PIX
            </label>
            <select 
              value={pixKeyType}
              onChange={(e) => setPixKeyType(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all appearance-none"
            >
              <option value="cpf">CPF</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="random">Chave aleatória</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              {getPixKeyTypeIcon()}
              Chave PIX
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={getPixKeyTypePlaceholder()}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <motion.button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg shadow-blue-800/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <span>Solicitar Saque</span>
              <ArrowRightCircle size={18} />
            </>
          )}
        </motion.button>
        
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-300 text-sm font-medium py-2 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
          <CheckCircle size={32} className="text-blue-500" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">Saque solicitado!</h3>
        <p className="text-slate-400 text-sm">
          O seu saque foi solicitado com sucesso e está sendo processado.
        </p>
      </div>
      
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-400 text-sm">Valor</span>
          <span className="text-white font-semibold">{formatCurrency(transaction?.amount || 0)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-400 text-sm">Chave PIX</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white">{pixKey.length > 12 ? pixKey.substring(0, 12) + '...' : pixKey}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(pixKey);
                toast.success('Chave PIX copiada!');
              }}
              className="text-slate-400 hover:text-slate-300"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-400 text-sm">Status</span>
          <div className="flex items-center gap-1.5 text-amber-500">
            <Clock size={14} />
            <span>Pendente</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Previsão</span>
          <span className="text-white">Em até 24 horas</span>
        </div>
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 text-sm">
          Você receberá uma notificação assim que o saque for processado. O valor será enviado para a chave PIX informada.
        </p>
      </div>
      
      <div className="flex justify-center">
        <motion.button 
          onClick={onClose}
          className="bg-slate-700/60 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Fechar
        </motion.button>
      </div>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-800/50 relative"
        style={{maxWidth: "420px"}}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <ArrowDownCircle size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {step === 1 ? 'Realizar Saque' : 'Saque Solicitado'}
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 ? renderStepOne() : renderStepTwo()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawModal;