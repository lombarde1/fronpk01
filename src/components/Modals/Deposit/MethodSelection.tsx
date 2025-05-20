import React from 'react';
import { QrCode, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MethodSelectionProps {
  user: any;
  onMethodSelect: (method: string) => void;
}

const MethodSelection: React.FC<MethodSelectionProps> = ({ user, onMethodSelect }) => {
  const isCardDisabled = !user.balance || user.balance === 0;
  
  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div 
          onClick={() => onMethodSelect('pix')}
          className="relative flex items-center p-5 bg-gradient-to-r from-green-500/10 to-green-400/5 hover:from-green-500/20 hover:to-green-400/10 rounded-xl cursor-pointer transition-all duration-300 border border-green-500/30 hover:border-green-500/50 group overflow-hidden"
        >
          {/* Fundo decorativo */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/20 mr-4 shrink-0">
            <QrCode size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-green-400 transition-colors">PIX</h3>
            <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Depósito instantâneo via PIX</p>
          </div>
          <motion.div 
            className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center ml-2 text-green-400"
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ scale: 1.2, x: 0, opacity: 1 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div 
          onClick={() => !isCardDisabled && onMethodSelect('card')}
          className={`relative flex items-center p-5 rounded-xl transition-all duration-300 overflow-hidden ${
            isCardDisabled 
              ? 'bg-slate-800/30 cursor-not-allowed border border-slate-700/30' 
              : 'bg-gradient-to-r from-blue-500/10 to-blue-400/5 hover:from-blue-500/20 hover:to-blue-400/10 cursor-pointer border border-blue-500/30 hover:border-blue-500/50 group'
          }`}
        >
          {/* Fundo decorativo */}
          {!isCardDisabled && (
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          )}
          
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mr-4 shrink-0 ${
            isCardDisabled 
              ? 'bg-slate-700/50 shadow-none' 
              : 'bg-gradient-to-br from-blue-500 to-blue-400 shadow-blue-500/20'
          }`}>
            <CreditCard size={24} className={isCardDisabled ? 'text-slate-500' : 'text-white'} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-lg mb-1 ${
              isCardDisabled 
                ? 'text-slate-500' 
                : 'text-white group-hover:text-blue-400 transition-colors'
            }`}>
              Cartão de Crédito
            </h3>
            <p className={isCardDisabled 
              ? 'text-slate-500 text-sm' 
              : 'text-slate-400 text-sm group-hover:text-slate-300 transition-colors'
            }>
              {isCardDisabled
                ? 'Disponível após primeiro depósito via PIX' 
                : 'Depósito rápido via cartão de crédito'}
            </p>
          </div>
          {!isCardDisabled && (
            <motion.div 
              className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center ml-2 text-blue-400"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ scale: 1.2, x: 0, opacity: 1 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Aviso sobre segurança */}
      <motion.div 
        className="mt-8 bg-slate-800/30 rounded-xl p-4 border border-slate-700/40 text-center"
        variants={itemVariants}
      >
        <p className="text-slate-400 text-sm">
          Todos os pagamentos são processados com segurança 🔒
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MethodSelection;