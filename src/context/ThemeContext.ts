import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import theme from '../theme';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof theme.colors;
  borderRadius: typeof theme.borderRadius;
  shadows: typeof theme.shadows;
};

const defaultContextValue: ThemeContextType = {
  isDark: true,
  toggleTheme: () => {},
  colors: theme.colors,
  borderRadius: theme.borderRadius,
  shadows: theme.shadows
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('peakbet-dark-mode', String(!isDark));
  };

  useEffect(() => {
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('peakbet-dark-mode');
    if (savedTheme !== null) {
      setIsDark(savedTheme === 'true');
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Aplicar classes CSS globais com base no tema
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDark]);

  // Aplicar variáveis CSS para as cores do tema
  useEffect(() => {
    const root = document.documentElement;
    
    // Cores primárias
    root.style.setProperty('--color-primary', theme.colors.primary.main);
    root.style.setProperty('--color-primary-light', theme.colors.primary.light);
    root.style.setProperty('--color-primary-dark', theme.colors.primary.dark);
    
    // Cores de background
    if (isDark) {
      // Modo escuro (padrão)
      root.style.setProperty('--bg-gradient', theme.colors.background.default);
      root.style.setProperty('--bg-paper', theme.colors.background.paper);
      root.style.setProperty('--bg-elevated', theme.colors.background.elevated);
      root.style.setProperty('--bg-card', theme.colors.background.card);
    } else {
      // Modo claro (opcional, se implementado)
      root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)');
      root.style.setProperty('--bg-paper', '#F5F5FF');
      root.style.setProperty('--bg-elevated', '#FFFFFF');
      root.style.setProperty('--bg-card', '#ECECFF');
    }
    
    // Cores de texto
    if (isDark) {
      root.style.setProperty('--text-primary', theme.colors.text.primary);
      root.style.setProperty('--text-secondary', theme.colors.text.secondary);
    } else {
      root.style.setProperty('--text-primary', '#1A237E');
      root.style.setProperty('--text-secondary', '#3949AB');
    }
    
    // Border radius
    root.style.setProperty('--border-radius-sm', theme.borderRadius.small);
    root.style.setProperty('--border-radius-md', theme.borderRadius.medium);
    root.style.setProperty('--border-radius-lg', theme.borderRadius.large);
    
    // Shadows
    root.style.setProperty('--shadow-card', theme.shadows.card);
    root.style.setProperty('--shadow-elevated', theme.shadows.elevated);
    root.style.setProperty('--shadow-button', theme.shadows.button);
  }, [isDark]);

  return (
    <ThemeContext.Provider 
      value={{ 
        isDark, 
        toggleTheme, 
        colors: theme.colors,
        borderRadius: theme.borderRadius,
        shadows: theme.shadows
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;