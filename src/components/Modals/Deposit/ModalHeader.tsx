import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModalHeaderProps {
  step: string;
  onBack: () => void;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ step, onBack, onClose }) => {
  // Função para obter o título e ícone com base na etapa atual
  const getTitle = () => {
    switch (step) {
      case 'select-method':
        return { title: 'Realizar Depósito', icon: '💰' };
      case 'pix-amount':
        return { title: 'Depósito via PIX', icon: '📱' };
      case 'pix-qrcode':
        return { title: 'QR Code PIX', icon: '📲' };
      case 'card-amount':
        return { title: 'Depósito via Cartão', icon: '💳' };
      case 'card-user':
        return { title: 'Dados do Titular', icon: '👤' };
      case 'card-details':
        return { title: 'Dados do Cartão', icon: '🔒' };
      default:
        return { title: 'Depósito', icon: '💰' };
    }
  };

  const { title, icon } = getTitle();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {step !== 'select-method' ? (
          <motion.button
            onClick={onBack}
            className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} />
          </motion.button>
        ) : (
          <motion.div
            className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <span className="text-lg">{icon}</span>
          </motion.div>
        )}
        <motion.h2 
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          key={title} // Para animar quando o título muda
        >
          {title}
        </motion.h2>
      </div>
      <motion.button 
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={18} />
      </motion.button>
    </div>
  );
};

export default ModalHeader;