import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import DynamicIcon from '../common/DynamicIcon';
import { useTheme } from '../../context/ThemeContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const discountedPrice = product.price - (product.price * (product.discount / 100));
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block relative group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {product.discount}% OFF
            </div>
          )}
          
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? 'opacity-10' : 'opacity-0'
            }`}
          ></div>
          
          <button
            onClick={toggleLike}
            className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm transition-transform duration-300 hover:scale-110"
          >
            {isLiked ? (
              <DynamicIcon name="heartFilled" color="#ef4444" size="sm" animate="pulse" />
            ) : (
              <DynamicIcon name="heart" size="sm" color={theme === 'dark' ? '#e2e8f0' : '#4b5563'} />
            )}
          </button>
        </div>
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/products/${product.id}`} className="block group">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-1 flex items-center">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <DynamicIcon 
                key={i} 
                name="star" 
                size="xs" 
                color={i < Math.round(product.rating) ? '#facc15' : '#d1d5db'} 
                withHoverEffect={false}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviews})</span>
        </div>
        
        <div className="mt-2 mb-3">
          <div className="flex items-center">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <DynamicIcon name="cart" size="sm" color="#ffffff" withHoverEffect={false} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;