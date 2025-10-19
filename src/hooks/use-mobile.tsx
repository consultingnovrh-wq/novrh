import { useEffect, useState } from 'react';

// Hook pour détecter la taille d'écran
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Hook pour détecter la taille d'écran avec breakpoints spécifiques
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};

// Composant pour masquer/afficher selon la taille d'écran
interface ResponsiveProps {
  children: React.ReactNode;
  showOn?: 'mobile' | 'desktop' | 'tablet' | 'all';
  hideOn?: 'mobile' | 'desktop' | 'tablet';
  className?: string;
}

export const Responsive = ({ children, showOn = 'all', hideOn, className = '' }: ResponsiveProps) => {
  const breakpoint = useBreakpoint();
  
  const shouldShow = () => {
    if (hideOn) {
      if (hideOn === 'mobile' && breakpoint === 'sm') return false;
      if (hideOn === 'tablet' && breakpoint === 'md') return false;
      if (hideOn === 'desktop' && ['lg', 'xl', '2xl'].includes(breakpoint)) return false;
      return true;
    }
    
    if (showOn === 'all') return true;
    if (showOn === 'mobile' && breakpoint === 'sm') return true;
    if (showOn === 'tablet' && breakpoint === 'md') return true;
    if (showOn === 'desktop' && ['lg', 'xl', '2xl'].includes(breakpoint)) return true;
    
    return false;
  };

  if (!shouldShow()) return null;

  return <div className={className}>{children}</div>;
};

// Composant pour les grilles responsives
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-4',
  className = ''
}: ResponsiveGridProps) => {
  const breakpoint = useBreakpoint();
  
  const getGridCols = () => {
    if (breakpoint === 'sm') return `grid-cols-${cols.mobile || 1}`;
    if (breakpoint === 'md') return `grid-cols-${cols.tablet || 2}`;
    return `grid-cols-${cols.desktop || 3}`;
  };

  return (
    <div className={`grid ${getGridCols()} ${gap} ${className}`}>
      {children}
    </div>
  );
};

// Composant pour les conteneurs responsives
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'xl',
  padding = 'md',
  className = ''
}: ResponsiveContainerProps) => {
  const paddingClasses = {
    sm: 'px-2 py-4',
    md: 'px-4 py-6',
    lg: 'px-6 py-8',
    xl: 'px-8 py-12'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`container mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Composant pour les textes responsives
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const ResponsiveText = ({ 
  children, 
  size = { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' },
  weight = 'normal',
  className = ''
}: ResponsiveTextProps) => {
  const breakpoint = useBreakpoint();
  
  const getTextSize = () => {
    if (breakpoint === 'sm') return size.mobile || 'text-sm';
    if (breakpoint === 'md') return size.tablet || 'text-base';
    return size.desktop || 'text-lg';
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <span className={`${getTextSize()} ${weightClasses[weight]} ${className}`}>
      {children}
    </span>
  );
};

// Composant pour les boutons responsives
interface ResponsiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: {
    mobile?: 'sm' | 'md' | 'lg';
    tablet?: 'sm' | 'md' | 'lg';
    desktop?: 'sm' | 'md' | 'lg';
  };
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ResponsiveButton = ({ 
  children, 
  variant = 'primary',
  size = { mobile: 'md', tablet: 'md', desktop: 'md' },
  fullWidth = false,
  className = '',
  onClick
}: ResponsiveButtonProps) => {
  const breakpoint = useBreakpoint();
  
  const getButtonSize = () => {
    if (breakpoint === 'sm') return size.mobile || 'md';
    if (breakpoint === 'md') return size.tablet || 'md';
    return size.desktop || 'md';
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'text-primary hover:bg-primary/10'
  };

  const buttonSize = getButtonSize();
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[buttonSize]} ${variantClasses[variant]} ${widthClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Composant pour les cartes responsives
interface ResponsiveCardProps {
  children: React.ReactNode;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

export const ResponsiveCard = ({ 
  children, 
  padding = { mobile: 'p-4', tablet: 'p-6', desktop: 'p-8' },
  className = ''
}: ResponsiveCardProps) => {
  const breakpoint = useBreakpoint();
  
  const getPadding = () => {
    if (breakpoint === 'sm') return padding.mobile || 'p-4';
    if (breakpoint === 'md') return padding.tablet || 'p-6';
    return padding.desktop || 'p-8';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border ${getPadding()} ${className}`}>
      {children}
    </div>
  );
};

// Utilitaires pour les classes CSS responsives
export const responsiveClasses = {
  // Grilles
  grid: {
    mobile1: 'grid-cols-1',
    mobile2: 'grid-cols-2',
    tablet1: 'md:grid-cols-1',
    tablet2: 'md:grid-cols-2',
    tablet3: 'md:grid-cols-3',
    desktop2: 'lg:grid-cols-2',
    desktop3: 'lg:grid-cols-3',
    desktop4: 'lg:grid-cols-4',
    desktop6: 'lg:grid-cols-6'
  },
  
  // Flexbox
  flex: {
    mobileCol: 'flex-col',
    mobileRow: 'flex-row',
    tabletCol: 'md:flex-col',
    tabletRow: 'md:flex-row',
    desktopCol: 'lg:flex-col',
    desktopRow: 'lg:flex-row'
  },
  
  // Espacement
  spacing: {
    mobileTight: 'space-y-2',
    mobileNormal: 'space-y-4',
    mobileLoose: 'space-y-6',
    tabletTight: 'md:space-y-2',
    tabletNormal: 'md:space-y-4',
    tabletLoose: 'md:space-y-6',
    desktopTight: 'lg:space-y-2',
    desktopNormal: 'lg:space-y-4',
    desktopLoose: 'lg:space-y-6'
  },
  
  // Texte
  text: {
    mobileSmall: 'text-sm',
    mobileBase: 'text-base',
    mobileLarge: 'text-lg',
    tabletSmall: 'md:text-sm',
    tabletBase: 'md:text-base',
    tabletLarge: 'md:text-lg',
    tabletXLarge: 'md:text-xl',
    desktopSmall: 'lg:text-sm',
    desktopBase: 'lg:text-base',
    desktopLarge: 'lg:text-lg',
    desktopXLarge: 'lg:text-xl',
    desktop2XLarge: 'lg:text-2xl'
  },
  
  // Padding
  padding: {
    mobileSmall: 'p-2',
    mobileNormal: 'p-4',
    mobileLarge: 'p-6',
    tabletSmall: 'md:p-2',
    tabletNormal: 'md:p-4',
    tabletLarge: 'md:p-6',
    tabletXLarge: 'md:p-8',
    desktopSmall: 'lg:p-2',
    desktopNormal: 'lg:p-4',
    desktopLarge: 'lg:p-6',
    desktopXLarge: 'lg:p-8',
    desktop2XLarge: 'lg:p-12'
  },
  
  // Margin
  margin: {
    mobileSmall: 'm-2',
    mobileNormal: 'm-4',
    mobileLarge: 'm-6',
    tabletSmall: 'md:m-2',
    tabletNormal: 'md:m-4',
    tabletLarge: 'md:m-6',
    tabletXLarge: 'md:m-8',
    desktopSmall: 'lg:m-2',
    desktopNormal: 'lg:m-4',
    desktopLarge: 'lg:m-6',
    desktopXLarge: 'lg:m-8',
    desktop2XLarge: 'lg:m-12'
  }
};

export default {
  useMobile,
  useBreakpoint,
  Responsive,
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveCard,
  responsiveClasses
};