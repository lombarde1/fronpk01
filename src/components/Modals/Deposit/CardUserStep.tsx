import React from 'react';
import { User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardFormData } from '../../hooks/useDepositForm';

interface CardUserStepProps {
  cardForm: CardFormData;
  handleCardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
}

const CardUserStep: React.FC<CardUserStepProps> = ({
  cardForm,
  handleCardInputChange,
  onContinue
}) => {
  const isFormValid = cardForm.holderName.length >= 3 && cardForm.cpf.replace(/\D/g, '').length === 11;

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="mb-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-300 mb-2">Nome do titular (como está no cartão)</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70">
            <User size={18} />
          </div>
          <input
            type="text"
            name="holderName"
            value={cardForm.holderName}
            onChange={handleCardInputChange}
            placeholder="NOME COMPLETO"
            className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
          />
        </div>
        {cardForm.holderName && cardForm.holderName.length < 3 && (
          <p className="text-red-400 text-xs mt-1 ml-1">Nome deve ter pelo menos 3 caracteres</p>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-300 mb-2">CPF do titular</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70">
            <CreditCard size={18} />
          </div>
          <input
            type="text"
            name="cpf"
            value={cardForm.cpf}
            onChange={handleCardInputChange}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
          />
        </div>
        {cardForm.cpf && cardForm.cpf.replace(/\D/g, '').length !== 11 && (
          <p className="text-red-400 text-xs mt-1 ml-1">CPF inválido</p>
        )}
      </motion.div>
      
      {/* Texto explicativo */}
      <motion.div 
        className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20"
        variants={itemVariants}
      >
        <p className="text-blue-400 text-sm">
          Os dados do titular são necessários para validação do pagamento e sua segurança.
        </p>
      </motion.div>
      
      <motion.button 
        onClick={onContinue}
        disabled={!isFormValid}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuar
      </motion.button>

      {/* Aviso de segurança */}
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/30">
          <p className="text-slate-400 text-xs flex items-center">
            <span className="mr-2">🔒</span>
            Seus dados estão protegidos
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardUserStep;