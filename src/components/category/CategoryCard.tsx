import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryInfo } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryInfo;
  variant?: 'default' | 'compact' | 'large';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, variant = 'default' }) => {
  return (
    <Link to={`/category/${category.id}`}>
      <motion.article
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative rounded-2xl overflow-hidden group',
          variant === 'compact' && 'aspect-square',
          variant === 'default' && 'aspect-[3/4]',
          variant === 'large' && 'aspect-[4/5] md:aspect-[3/4]'
        )}
      >
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className={cn(
            'font-display font-semibold text-white',
            variant === 'compact' ? 'text-sm' : 'text-lg md:text-xl'
          )}>
            {category.shortName}
          </h3>
          {variant !== 'compact' && (
            <p className="text-white/80 text-xs md:text-sm mt-0.5 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>

        {/* Color Accent */}
        <div
          className="absolute top-3 right-3 w-3 h-3 rounded-full opacity-80"
          style={{ backgroundColor: category.color }}
        />
        
        {/* Ramadan Decorations - Stars and Bells on Hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Top Left Corner - Star */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1, rotate: 0 }}
            className="absolute top-2 left-2 text-2xl drop-shadow-lg"
          >
            ⭐
          </motion.div>
          {/* Top Right Corner - Sparkles */}
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1, rotate: 0 }}
            className="absolute top-2 right-2 text-2xl drop-shadow-lg"
          >
            ✨
          </motion.div>
          {/* Left Side - Bell */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-2xl drop-shadow-lg"
            >
              🔔
            </motion.span>
          </motion.div>
          {/* Bottom Left - Star */}
          <motion.div
            initial={{ scale: 0, y: 10 }}
            whileHover={{ scale: 1, y: 0 }}
            className="absolute bottom-2 left-2 text-xl drop-shadow-lg"
          >
            ⭐
          </motion.div>
        </div>
      </motion.article>
    </Link>
  );
};

interface CategoryGridProps {
  categories: CategoryInfo[];
  variant?: 'scroll' | 'grid';
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, variant = 'scroll' }) => {
  if (variant === 'scroll') {
    return (
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 py-2">
        <div className="flex gap-3 w-max">
          {categories.map(cat => (
            <div key={cat.id} className="w-36 md:w-44 flex-shrink-0">
              <CategoryCard category={cat} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-2 md:px-0">
      {categories.map(cat => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
};
