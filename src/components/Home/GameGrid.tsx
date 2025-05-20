import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';

interface GameGridProps {
  games: any[];
  loading: boolean;
  selectedCategory: string;
  onGameClick: (game: any) => void;
}

const GameGrid: React.FC<GameGridProps> = ({
  games,
  loading,
  selectedCategory,
  onGameClick
}) => {
  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.05,
        ease: "easeOut",
        duration: 0.3
      }
    }
  };

  return (
    <section className="container mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold text-white flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedCategory === 'Todos' ? (
            <>
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Todos os Jogos</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Jogos de {selectedCategory}</span>
            </>
          )}
        </motion.h2>
        <motion.div 
          className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-400 rounded-full cursor-pointer shadow-lg shadow-amber-500/20 group hover:shadow-amber-500/30 transition-all duration-300"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown size={20} className="text-slate-900 group-hover:animate-pulse" />
        </motion.div>
      </div>

      {loading ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(10)].map((_, index) => (
            <div 
              key={index}
              className="bg-gradient-to-tr from-slate-800/50 to-slate-700/30 rounded-2xl overflow-hidden aspect-[3/4] animate-pulse"
            />
          ))}
        </motion.div>
      ) : games.length === 0 ? (
        <motion.div 
          className="text-center py-16 px-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-slate-700/50 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-lg text-slate-300">Nenhum jogo encontrado na categoria {selectedCategory}</p>
          <p className="text-slate-500 mt-2">Tente selecionar outra categoria</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <GameCard 
              key={game._id}
              game={game}
              onClick={() => onGameClick(game)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default GameGrid;