import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  // Animação para o container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };
  
  // Animação para cada item
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="container mx-auto px-4 pt-8">
      <motion.div 
        className="scrollbar-hide overflow-x-auto pb-4 mask-fade-right"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex space-x-3 min-w-max">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 scale-105' 
                  : 'bg-slate-800/70 hover:bg-slate-700/90 text-slate-300 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600'
              }`}
              variants={itemVariants}
              whileHover={{ scale: selectedCategory === category ? 1.05 : 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Estilo para o efeito de fade nos lados da rolagem */}
      <style jsx global>{`
        .mask-fade-right {
          -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0));
          mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0));
        }
        
        /* Ocultando a barra de rolagem para maior elegância */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryFilter;