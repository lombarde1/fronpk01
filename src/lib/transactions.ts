import api from './api';

interface CreditCardDepositData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  holderName: string;
  cpf: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BET' | 'WIN';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export async function generatePixDeposit(amount: number) {
  try {
    const response = await api.post('/api/pix/generate', { amount });
    return response.data?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao gerar depósito PIX');
  }
}

export async function checkPixStatus(externalId: string) {
  try {
    const response = await api.get(`/api/pix/status/${externalId}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao verificar status do PIX');
  }
}
export async function requestWithdrawal(data: {
  amount: number;
  paymentMethod: string;
  pixKey: string;
  pixKeyType: string;
}) {
  try {
    const response = await api.post('/api/transactions/withdraw', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao solicitar saque');
  }
}

export async function processDeposit(amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await api.post('/api/transactions/deposit', { amount });
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Erro ao processar depósito' 
    };
  }
}

export async function processWithdrawal(amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await api.post('/api/transactions/withdraw', { amount });
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Erro ao processar saque' 
    };
  }
}

export async function getTransactions(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}): Promise<{ transactions: Transaction[]; total: number; pages: number }> {
  try {
    const response = await api.get('/api/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { transactions: [], total: 0, pages: 1 };
  }
}

export async function processCreditCardDeposit(data: CreditCardDepositData) {
  try {
    const response = await api.post('/api/credit-card/deposit', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao processar pagamento');
  }
}