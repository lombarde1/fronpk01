import { useState, useEffect } from 'react';
import { utmTrackingService, UTMParams } from '../lib/utmTracking';

export const useUTMTracking = () => {
  const [utmParams, setUtmParams] = useState<UTMParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUTMs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Carregar UTMs do backend
        const params = await utmTrackingService.loadUTMsFromBackend();
        
        if (isMounted) {
          setUtmParams(params);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar UTMs');
          console.error('Erro no hook useUTMTracking:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Carregar UTMs quando o componente montar
    loadUTMs();

    // Configurar polling para atualizar UTMs periodicamente (opcional)
    const interval = setInterval(() => {
      if (isMounted) {
        utmTrackingService.loadUTMsFromBackend().then(params => {
          if (isMounted) {
            setUtmParams(params);
          }
        });
      }
    }, 60000); // A cada 1 minuto

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Função para obter dados de tracking completos
  const getTrackingData = (): UTMParams => {
    return utmTrackingService.getTrackingData();
  };

  // Função para forçar refresh dos UTMs
  const refreshUTMs = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = await utmTrackingService.refresh();
      setUtmParams(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar UTMs');
      console.error('Erro ao fazer refresh dos UTMs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para extrair UTMs da URL atual
  const getURLUTMs = (): UTMParams => {
    return utmTrackingService.extractUTMsFromURL();
  };

  return {
    utmParams,
    isLoading,
    error,
    getTrackingData,
    refreshUTMs,
    getURLUTMs
  };
}; 