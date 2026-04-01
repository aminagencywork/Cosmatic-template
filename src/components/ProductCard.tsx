import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../lib/supabase';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercentage = product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-4 bg-neutral">
          <img 
            src={product.images[0] || 'https://picsum.photos/seed/beauty/600/800'} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-accent text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
            <button className="w-full py-2 md:py-3 bg-white/90 backdrop-blur-md text-primary text-[10px] md:text-xs font-bold rounded-lg md:rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all">
              QUICK VIEW
            </button>
          </div>
        </div>
        <div className="space-y-0.5 md:space-y-1">
          <p className="text-[8px] md:text-[10px] font-bold text-accent uppercase tracking-widest">{product.brand}</p>
          <h3 className="font-medium text-xs md:text-sm group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="font-bold text-xs md:text-sm">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (
              <span className="text-[10px] md:text-xs text-primary/40 line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
