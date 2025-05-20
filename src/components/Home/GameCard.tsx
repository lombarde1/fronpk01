import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

interface GameCardProps {
  game: any;
  onClick: () => void;
  variants?: Variants;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, variants }) => {
  // Animações e transições
  const imageVariants = {
    hover: { scale: 1.08, transition: { duration: 0.3 } },
    tap: { scale: 1.03 }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.6 },
    hover: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 17 }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0.3 },
    hover: { opacity: 0.7, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 transform-gpu will-change-transform bg-gradient-to-r from-slate-800/90 to-slate-700/80 border-2 border-slate-700/40 hover:border-amber-500/20"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {/* Overlay gradiente */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"
          variants={overlayVariants}
          initial="initial"
        />
        
        {/* Imagem do jogo */}
        <motion.img 
          src={game.imageUrl} 
          alt={game.name}
          className="w-full h-full object-cover object-center transition-transform duration-300"
          variants={imageVariants}
          loading="lazy"
        />
        
        {/* Nome do jogo (opcional - pode ser ativado se necessário) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-medium text-center text-lg tracking-wide truncate">
            {game.name}
          </h3>
        </div>
        
        {/* Ícone e botão de jogar */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
          variants={buttonVariants}
          initial="initial"
        >
          <div className="flex flex-col items-center">
            <PlayCircle className="h-14 w-14 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] mb-3" />
            <button className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 font-semibold py-2.5 px-5 rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-amber-500/50">
              Jogar Agora
            </button>
          </div>
        </motion.div>
        
        {/* Badge de novo/destaque (opcional) */}
        {game.isNew && (
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-xs font-bold py-1 px-2 rounded-full z-30">
            NOVO
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GameCard;