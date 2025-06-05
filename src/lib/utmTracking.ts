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

// Função customizada para enviar eventos para UTMify
export const sendUTMifyEvent = async (eventName: string, eventData: any = {}) => {
  try {
    const pixelId = "68410d8f35b494dc5f043550";
    
    // Obter IP do usuário
    let userIP = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      userIP = ipData.ip;
    } catch (error) {
      console.log('Erro ao obter IP:', error);
    }

    // Obter UTMs da URL atual
    const currentUTMs = utmTrackingService.extractUTMsFromURL();
    const urlParams = new URLSearchParams();
    
    // Montar parâmetros da URL
    Object.entries(currentUTMs).forEach(([key, value]) => {
      if (value) {
        urlParams.append(key, value);
      }
    });
    
    const parametersString = urlParams.toString() ? `?${urlParams.toString()}` : '';

    // Preparar payload no formato correto da UTMify
    const payload = {
      type: eventName,
      lead: {
        pixelId: pixelId,
        metaPixelIds: ["750651513952927"], // ID do Facebook Pixel
        geolocation: {
          country: "BR",
          city: "",
          state: "",
          zipcode: ""
        },
        userAgent: navigator.userAgent,
        ip: userIP || "unknown",
        fbp: null, // Facebook Browser ID se disponível
        updatedAt: new Date().toISOString(),
        icTextMatch: null,
        icCSSMatch: null,
        icURLMatch: null,
        leadTextMatch: null,
        addToCartTextMatch: null,
        ipConfiguration: "IPV6_OR_IPV4",
        parameters: parametersString
      },
      event: {
        sourceUrl: document.referrer || "https://peakbet.site/",
        pageTitle: document.title || "Peakbet",
        ...eventData // Dados adicionais do evento
      }
    };

    console.log(`Enviando evento ${eventName} para UTMify:`, payload);

    // Enviar para a API correta da UTMify
    const response = await fetch('https://tracking.utmify.com.br/tracking/v1/events', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'Referer': window.location.href,
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`Evento ${eventName} enviado com sucesso para UTMify!`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Erro ao enviar evento ${eventName}:`, response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao enviar evento ${eventName} para UTMify:`, error);
    return false;
  }
}; 