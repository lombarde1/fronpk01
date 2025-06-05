import React from 'react';
import { Loader, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface PixAmountStepProps {
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  isGeneratingPix: boolean;
  onGeneratePix: () => void;
}

const PixAmountStep: React.FC<PixAmountStepProps> = ({
  depositAmount,
  setDepositAmount,
  isGeneratingPix,
  onGeneratePix
}) => {
  const predefinedAmounts = [25, 50, 100, 200, 500, 1000];

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
            onClick={() => setDepositAmount(amount)}
            className={`py-3 rounded-xl font-bold transition-all duration-300 ${
              depositAmount === amount 
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 scale-105' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600/50'
            }`}
            whileHover={{ scale: depositAmount === amount ? 1.05 : 1.03 }}
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
            <DollarSign size={18} />
          </div>
          <input
            type="number"
            min="25"
            max="10000"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700/50 focus:border-amber-500/50 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 ml-1">Valor mínimo: R$ 25,00</p>
      </motion.div>
      
      <motion.button 
        onClick={onGeneratePix}
        disabled={isGeneratingPix || depositAmount < 25}
        className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isGeneratingPix ? (
          <div className="flex items-center justify-center">
            <Loader size={20} className="animate-spin mr-2" />
            <span>Gerando código...</span>
          </div>
        ) : 'Gerar Código PIX'}
      </motion.button>

      {/* Aviso de segurança */}
      <motion.div 
        className="mt-6 text-center text-slate-500 text-xs"
        variants={itemVariants}
      >
        <p>Pagamento processado com segurança 🔒</p>
      </motion.div>
    </motion.div>
  );
};

export default PixAmountStep;