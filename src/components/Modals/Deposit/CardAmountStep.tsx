import React from 'react';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardFormData } from '../../hooks/useDepositForm';

interface CardAmountStepProps {
  cardForm: CardFormData;
  setCardForm: (form: CardFormData) => void;
  onContinue: () => void;
}

const CardAmountStep: React.FC<CardAmountStepProps> = ({
  cardForm,
  setCardForm,
  onContinue
}) => {
  const predefinedAmounts = [20, 50, 100, 200, 500, 1000];

  const handleAmountChange = (amount: number) => {
    setCardForm({
      ...cardForm,
      amount
    });
  };

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
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p className="text-slate-300 mb-5" variants={itemVariants}>
        Escolha o valor para depositar:
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-3 gap-3 mb-6"
        variants={itemVariants}
      >
        {predefinedAmounts.map((amount, index) => (
          <motion.button
            key={amount}
            onClick={() => handleAmountChange(amount)}
            className={`py-3 rounded-xl font-bold transition-all duration-300 ${
              cardForm.amount === amount 
                ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/20 scale-105' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600/50'
            }`}
            whileHover={{ scale: cardForm.amount === amount ? 1.05 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            custom={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: (i) => ({
                opacity: 1,
                y: 0,
                transition: { 
                  delay: i * 0.05,
                  duration: 0.3
                }
              })
            }}
          >
            R$ {amount}
          </motion.button>
        ))}
      </motion.div>
      
      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-400 mb-2">Valor personalizado</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <DollarSign size={18} />
          </div>
          <input
            type="number"
            min="10"
            max="10000"
            value={cardForm.amount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 ml-1">Valor mínimo: R$ 10,00</p>
      </motion.div>
      
      <motion.button 
        onClick={onContinue}
        disabled={cardForm.amount < 10}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuar
      </motion.button>

      {/* Aviso de segurança */}
      <motion.div 
        className="mt-6 text-center flex items-center justify-center"
        variants={itemVariants}
      >
        <div className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/30">
          <p className="text-slate-400 text-xs flex items-center">
            <span className="mr-2">🔒</span>
            Pagamento seguro via cartão de crédito
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardAmountStep;