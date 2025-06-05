import api from './api';
import jwtDecode from 'jwt-decode';

interface AuthResponse {
  user?: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    balance: number;
  };
  token?: string;
  error?: string;
}

export async function signUp(
  username: string,
  password: string,
  fullName: string,
): Promise<AuthResponse> {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      password,
      fullName,
      role: 'user'
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);

    return { user, token };
  } catch (error) {
    return { error: error.response?.data?.message || 'Erro ao registrar usuário' };
  }
}

export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post('/api/auth/login', {
      username,
      password
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);

    return { user, token };
  } catch (error) {
    return { error: error.response?.data?.message || 'Credenciais inválidas' };
  }
}

export function isAdmin(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded?.username === 'admindark';
  } catch {
    return false;
  }
}