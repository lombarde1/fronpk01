import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { useAuth, initializeAuth } from './hooks/useAuth';
import { utmTrackingService } from './lib/utmTracking';
import './styles/admin.css';

// Declaração de tipos para UTMify Pixel
declare global {
  interface Window {
    pixel?: {
      track: (eventName: string, data?: any) => void;
    };
  }
}

function App() {
  const { user, token, loading } = useAuth();

  // Inicializa a autenticação e UTM tracking ao carregar a aplicação
  useEffect(() => {
    initializeAuth();
    
    // Inicializar UTM tracking apenas se estiver autenticado
    if (user) {
      utmTrackingService.loadUTMsFromBackend().catch(error => {
        console.log('Erro ao carregar UTMs no App:', error);
      });
    }

    // Log para verificar se pixel UTMify está carregado
    const checkPixel = () => {
      if (window.pixel) {
        console.log('UTMify Pixel carregado e pronto para uso manual');
      } else {
        console.log('UTMify Pixel ainda não carregado');
      }
    };

    // Verificar após 2 segundos
    setTimeout(checkPixel, 2000);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] to-[#12172E] flex items-center justify-center">
        <div className="text-white flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#FFAB00] border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-xl font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] to-[#12172E] bg-fixed">
        <Routes>
          {!user ? (
            <>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#22254B',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            },
            success: {
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#F44336',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;