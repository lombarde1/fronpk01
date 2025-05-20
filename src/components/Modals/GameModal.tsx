import React from 'react';
import { motion } from 'framer-motion';

interface GameModalProps {
  game: any;
  onClose: () => void;
  onDepositClick: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose, onDepositClick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0F1C2E] rounded-2xl p-5 max-w-md w-full shadow-xl"
      >
        <div className="text-right mb-2">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="rounded-lg overflow-hidden mb-4">
          <img 
            src="https://i.imgur.com/7USvNta.png" 
            alt="Game information" 
            className="w-full h-auto"
          />
        </div>
        
        <button 
          onClick={onDepositClick}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors shadow-lg"
        >
          Depositar Agora
        </button>
      </motion.div>
    </div>
  );
};

export default GameModal;