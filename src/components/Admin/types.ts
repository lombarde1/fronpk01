// Interface para usuários
export interface User {
    _id: string;
    username: string;
    name: string;
    email: string;
    balance: number;
    createdAt: string;
    role: string;
    status: string;
  }
  
  // Interface para jogos
  export interface Game {
    _id: string;
    name: string;
    imageUrl: string;
    provider: string;
    category: string;
    isActive: boolean;
    isFeatured: boolean;
    minBet: number;
    maxBet: number;
    rtp: number;
    popularity: number;
  }
  
  // Interface para credenciais PIX
  export interface PixCredential {
    _id: string;
    id?: string;
    name: string;
    baseUrl: string;
    clientId: string;
    webhookUrl: string;
    provider: string;
    isActive: boolean;
  }
  
  // Interface para formulário de usuário
  export interface UserFormData {
    name: string;
    balance: number;
  }
  
  // Interface para formulário de jogo
  export interface GameFormData {
    name: string;
    imageUrl: string;
    provider: string;
    category: string;
    minBet: number;
    maxBet: number;
    rtp: number;
    isFeatured: boolean;
  }
  
  // Interface para formulário de credencial PIX
  export interface PixFormData {
    name: string;
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    webhookUrl: string;
    provider: string;
    isActive: boolean;
  }