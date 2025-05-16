import React, { useState } from 'react';
import { 
  FaShoppingCart, FaUserAlt, FaSearch, FaSignOutAlt, FaBoxOpen, 
  FaShippingFast, FaUsers, FaStar, FaHome, FaTags
} from 'react-icons/fa';
import { 
  MdDarkMode, MdLightMode, MdShoppingBag, MdLocalOffer, MdNotifications 
} from 'react-icons/md';
import { BiCategoryAlt, BiFilterAlt } from 'react-icons/bi';
import { HiOutlineChevronDown, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineChevronUp } from 'react-icons/hi';
import { RiCloseLine, RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

// Icon name type
export type IconName = 
  | 'cart' | 'user' | 'search' | 'logout' | 'box' 
  | 'shipping' | 'users' | 'star' | 'home' | 'tag'
  | 'darkMode' | 'lightMode' | 'bag' | 'offer' | 'notification'
  | 'category' | 'filter' | 'down' | 'left' | 'right' | 'up'
  | 'close' | 'heart' | 'heartFilled' | 'menu' | 'x';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizes = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '32px'
};

interface DynamicIconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  animate?: 'pulse' | 'bounce' | 'spin' | 'float' | 'none';
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
  withHoverEffect?: boolean;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 'md',
  className = '',
  animate = 'none',
  onClick,
  color,
  hoverColor,
  withHoverEffect = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  // Default colors based on theme
  const defaultColor = theme === 'dark' ? '#e2e8f0' : '#4b5563';
  const defaultHoverColor = theme === 'dark' ? '#60a5fa' : '#2563eb';

  // Apply colors with priority: props > default
  const currentColor = isHovered && withHoverEffect 
    ? (hoverColor || defaultHoverColor) 
    : (color || defaultColor);

  // Animation classes
  const animationClass = animate !== 'none' 
    ? `animate-${animate}` 
    : '';
  
  // Hover effect class
  const hoverClass = withHoverEffect 
    ? 'transition-all duration-300 transform hover:scale-110' 
    : '';

  // Combine all classes
  const combinedClassName = `${className} ${animationClass} ${hoverClass}`.trim();

  // Icon mapping
  const iconMap = {
    cart: FaShoppingCart,
    user: FaUserAlt,
    search: FaSearch,
    logout: FaSignOutAlt,
    box: FaBoxOpen,
    shipping: FaShippingFast,
    users: FaUsers,
    star: FaStar,
    home: FaHome,
    tag: FaTags,
    darkMode: MdDarkMode,
    lightMode: MdLightMode,
    bag: MdShoppingBag,
    offer: MdLocalOffer,
    notification: MdNotifications,
    category: BiCategoryAlt,
    filter: BiFilterAlt,
    down: HiOutlineChevronDown,
    up: HiOutlineChevronUp,
    left: HiOutlineChevronLeft,
    right: HiOutlineChevronRight,
    close: RiCloseLine,
    heart: RiHeartLine,
    heartFilled: RiHeartFill,
    menu: FiMenu,
    x: FiX
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <div 
      className={combinedClassName}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconComponent 
        size={sizes[size]} 
        color={currentColor}
        style={{ transition: 'all 0.3s ease' }}
      />
    </div>
  );
};

export default DynamicIcon; 