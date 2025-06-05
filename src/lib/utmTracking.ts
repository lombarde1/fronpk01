import api from './api';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  src?: string;
  sck?: string;
  fbclid?: string;
  gclid?: string;
  ip?: string;
  user_agent?: string;
  page_url?: string;
  referrer?: string;
}

class UTMTrackingService {
  private utmParams: UTMParams | null = null;
  private isLoading = false;
  private hasLoaded = false;

  // Obter IP do usuário usando serviço externo
  private async getUserIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return null;
    }
  }

  // Buscar UTMs do backend baseado no IP
  async loadUTMsFromBackend(): Promise<UTMParams | null> {
    if (this.isLoading || this.hasLoaded) return this.utmParams;
    
    this.isLoading = true;
    
    try {
      const ip = await this.getUserIP();
      if (!ip) {
        console.log('Não foi possível obter IP do usuário');
        return null;
      }

      console.log('Buscando UTMs para IP:', ip);

      const response = await api.get(`/api/tracking/get-utms?ip=${ip}`);
      
      if (response.data.success && response.data.found) {
        this.utmParams = response.data.data;
        this.hasLoaded = true;
        
        console.log('UTMs carregados do backend:', this.utmParams);
        
        // Aplicar UTMs à URL atual
        this.applyUTMsToCurrentURL();
        
        return this.utmParams;
      } else {
        console.log('Nenhum UTM encontrado no backend');
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar UTMs do backend:', error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // Aplicar UTMs à URL atual (sem recarregar a página)
  private applyUTMsToCurrentURL() {
    if (!this.utmParams) return;

    const url = new URL(window.location.href);
    let hasChanges = false;

    // Adicionar parâmetros UTM à URL se não existirem
    Object.entries(this.utmParams).forEach(([key, value]) => {
      if (value && !url.searchParams.has(key)) {
        // Apenas adicionar parâmetros UTM principais
        if (key.startsWith('utm_') || ['src', 'sck', 'fbclid', 'gclid'].includes(key)) {
          url.searchParams.set(key, value);
          hasChanges = true;
        }
      }
    });

    // Atualizar URL sem recarregar a página
    if (hasChanges) {
      window.history.replaceState({}, '', url.toString());
      console.log('URL atualizada com UTMs:', url.toString());
    }
  }

  // Obter UTMs atuais
  getUTMs(): UTMParams | null {
    return this.utmParams;
  }

  // Extrair UTMs da URL atual
  extractUTMsFromURL(): UTMParams {
    const urlParams = new URLSearchParams(window.location.search);
    const utms: UTMParams = {};

    // Parâmetros UTM padrão
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utms[key as keyof UTMParams] = value;
      }
    });

    // Outros parâmetros de tracking
    const otherKeys = ['src', 'sck', 'fbclid', 'gclid'];
    otherKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utms[key as keyof UTMParams] = value;
      }
    });

    return utms;
  }

  // Preparar dados para envio com requisições
  getTrackingData(): UTMParams {
    // Priorizar UTMs carregados do backend, senão usar da URL atual
    const backendUTMs = this.getUTMs();
    const urlUTMs = this.extractUTMsFromURL();
    
    return {
      ...backendUTMs,
      ...urlUTMs, // URL tem prioridade (mais recente)
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      referrer: document.referrer
    };
  }

  // Forçar recarregamento dos UTMs
  async refresh(): Promise<UTMParams | null> {
    this.hasLoaded = false;
    this.utmParams = null;
    return await this.loadUTMsFromBackend();
  }
}

// Instância singleton
export const utmTrackingService = new UTMTrackingService(); 