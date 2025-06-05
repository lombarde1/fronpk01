// Arquivo de tema para a aplicação PeakBET
// theme.ts

export const theme = {
    colors: {
      // Cores primárias
      primary: {
        main: '#FFAB00', // Amarelo/dourado - cor principal da marca
        light: '#FFD54F',
        dark: '#FF8F00',
        contrastText: '#0F172A'
      },
      
      // Cores de background
      background: {
        // Gradiente principal - de azul escuro para azul/violeta profundo 
        default: 'linear-gradient(135deg, #1A237E 0%, #12172E 100%)',
        
        // Fundo alternativo para cards e elementos flutuantes
        paper: '#1E1E4E',
        
        // Superfícies elevadas (modais, dropdowns)
        elevated: '#22254B',
        
        // Fundo dos cards de jogos
        card: '#2A265F',
        
        // Gradiente vibrante para CTA e elementos especiais
        accent: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)'
      },
      
      // Variantes de cinza para textos e borders
      text: {
        primary: '#FFFFFF',
        secondary: '#B8B8D4',
        disabled: '#6B6B99',
        hint: '#8C8CB4'
      },
      
      // Cores para estados e feedbacks
      state: {
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#29B6F6'
      },
      
      // Cores para elementos de UI
      ui: {
        divider: 'rgba(255, 255, 255, 0.12)',
        overlay: 'rgba(16, 16, 46, 0.8)',
        highlight: 'rgba(255, 171, 0, 0.15)',
        focus: '#6366F1'
      }
    },
    
    // Bordas arredondadas
    borderRadius: {
      small: '8px',
      medium: '12px',
      large: '16px',
      xl: '24px',
      pill: '9999px'
    },
    
    // Sombras para efeito de profundidade
    shadows: {
      card: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
      elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
      button: '0 4px 6px -1px rgba(255, 171, 0, 0.4), 0 2px 4px -2px rgba(255, 171, 0, 0.4)'
    }
  };
  
  export default theme;