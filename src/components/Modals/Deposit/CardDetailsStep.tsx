import React from 'react';
import { Loader, CreditCard, Calendar, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardFormData } from '../../hooks/useDepositForm';

interface CardDetailsStepProps {
  cardForm: CardFormData;
  handleCardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessingCard: boolean;
  onSubmit: () => void;
}

const CardDetailsStep: React.FC<CardDetailsStepProps> = ({
  cardForm,
  handleCardInputChange,
  isProcessingCard,
  onSubmit
}) => {
  // Valida se o formulário está completo
  const isFormValid = 
    cardForm.number.replace(/\s/g, '').length === 16 && 
    cardForm.expirationDate.length === 5 &&
    cardForm.cvv.length >= 3;

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
      {/* Card mockup */}
      <motion.div 
        className="w-full h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/20 px-5 py-4 relative overflow-hidden"
        variants={itemVariants}
      >
        {/* Background decor */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute right-20 bottom-10 w-20 h-20 bg-white/10 rounded-full"></div>
        
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="text-white h-6 w-6" />
            </div>
            <div className="text-white text-sm font-mono tracking-wide opacity-80">
              CRÉDITO
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-white/80 font-mono text-sm mb-1">Número do Cartão</div>
            <div className="font-mono tracking-wider text-white text-lg">
              {cardForm.number || '•••• •••• •••• ••••'}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/80 font-mono text-xs">TITULAR</div>
              <div className="text-white font-mono tracking-wide text-sm">
                {cardForm.holderName || 'NOME DO TITULAR'}
              </div>
            </div>
            <div>
              <div className="text-white/80 font-mono text-xs">VALIDADE</div>
              <div className="text-white font-mono tracking-wide text-sm">
                {cardForm.expirationDate || 'MM/AA'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-300 mb-2">Número do cartão</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70">
            <CreditCard size={18} />
          </div>
          <input
            type="text"
            name="number"
            value={cardForm.number}
            onChange={handleCardInputChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
          />
        </div>
      </motion.div>
      
      <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Validade</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70">
              <Calendar size={18} />
            </div>
            <input
              type="text"
              name="expirationDate"
              value={cardForm.expirationDate}
              onChange={handleCardInputChange}
              placeholder="MM/AA"
              maxLength={5}
              className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70">
              <LockKeyhole size={18} />
            </div>
            <input
              type="text"
              name="cvv"
              value={cardForm.cvv}
              onChange={handleCardInputChange}
              placeholder="000"
              maxLength={4}
              className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>
      
      <motion.button 
        onClick={onSubmit}
        disabled={isProcessingCard || !isFormValid}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessingCard ? (
          <div className="flex items-center justify-center">
            <Loader size={20} className="animate-spin mr-2" />
            <span>Processando...</span>
          </div>
        ) : 'Finalizar Depósito'}
      </motion.button>
      
      <motion.div 
        className="text-center space-y-3"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center">
          <div className="px-5 py-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-blue-400 text-xs flex items-center">
              <LockKeyhole className="h-4 w-4 mr-2" />
              Pagamento protegido por criptografia SSL
            </p>
          </div>
        </div>
        <p className="text-slate-500 text-xs px-6">
          Seus dados de pagamento são processados com segurança e não são armazenados após a transação.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CardDetailsStep;