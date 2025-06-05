import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  fullName: string;
  name?: string;
  phone: string;
  cpf: string;
  role: string;
  balance: number;
  status: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginError: string | null;
  
  // Ações
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  updateUserBalance: (newBalance: number) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      loginError: null,
      
      setUser: (user) => {
        // Normaliza os campos, já que a API pode retornar formatos diferentes
        if (user) {
          const normalizedUser: User = {
            id: user.id || user._id || '',
            username: user.username || '',
            email: user.email || '',
            fullName: user.fullName || user.name || '',
            name: user.name || user.fullName || '',
            phone: user.phone || '',
            cpf: user.cpf || '',
            role: user.role || 'USER',
            balance: typeof user.balance === 'number' ? user.balance : 0,
            status: user.status || 'ACTIVE',
            createdAt: user.createdAt || new Date().toISOString()
          };
          set({ user: normalizedUser });
        } else {
          set({ user: null });
        }
      },
      
      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ token });
        } else {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          set({ token: null, user: null });
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
        toast.success('Logout realizado com sucesso');
      },
      
      login: async (username, password) => {
        try {
          set({ loading: true, loginError: null });
          
          const response = await api.post('/api/auth/login', { username, password });
          
          // Extrai o token e verifica a resposta
          const data = response.data.data;
          
          if (data?.token) {
            const authState = get();
            authState.setToken(data.token);
            await authState.checkAuth();
          } else {
            set({ loginError: 'Resposta de login inválida' });
          }
        } catch (error) {
          console.error('Erro no login:', error);
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro ao fazer login';
          set({ loginError: errorMessage });
        } finally {
          set({ loading: false });
        }
      },
      
      checkAuth: async () => {
        const token = get().token || localStorage.getItem('token');
        
        if (!token) {
          set({ loading: false });
          return false;
        }
        
        try {
          set({ loading: true, error: null });
          
          // Garante que o token está nos headers
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            set({ token });
          }
          
          const response = await api.get('/api/auth/profile');
          const userData = response.data?.data || response.data?.user;
          
          if (userData) {
            // Normaliza os dados para o formato esperado
            const normalizedUser: User = {
              id: userData.id || userData._id || '',
              _id: userData._id || userData.id || '',
              username: userData.username || '',
              email: userData.email || '',
              fullName: userData.name || userData.fullName || '',
              name: userData.name || userData.fullName || '',
              phone: userData.phone || '',
              cpf: userData.cpf || '',
              role: userData.role || 'USER',
              balance: typeof userData.balance === 'number' ? userData.balance : 0,
              status: userData.status || 'ACTIVE',
              createdAt: userData.createdAt || new Date().toISOString()
            };
            
            set({ user: normalizedUser });
            return true;
          }
          
          set({ user: null });
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          return false;
        } catch (error) {
          console.error('Erro na verificação de autenticação:', error);
          set({ 
            user: null, 
            error: 'Erro ao verificar autenticação' 
          });
          
          // Se o erro for 401 (não autorizado), remove o token
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            set({ token: null });
          }
          
          return false;
        } finally {
          set({ loading: false });
        }
      },
      
      refreshUserData: async () => {
        const token = get().token;
        if (!token) return;
        
        try {
          const response = await api.get('/api/auth/profile');
          const userData = response.data?.data || response.data?.user;
          
          if (userData) {
            const currentUser = get().user || {};
            
            // Atualiza apenas os campos que existem na resposta
            const updatedUser = {
              ...currentUser,
              id: userData.id || userData._id || currentUser.id,
              _id: userData._id || userData.id || currentUser._id,
              balance: typeof userData.balance === 'number' ? userData.balance : currentUser.balance,
              status: userData.status || currentUser.status,
              role: userData.role || currentUser.role
            };
            
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error);
        }
      },
      
      updateUserBalance: (newBalance) => {
        const user = get().user;
        if (user) {
          set({ 
            user: { 
              ...user, 
              balance: newBalance 
            } 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      // Opcionalmente, você pode personalizar quais estados serão persistidos
      partialize: (state) => ({ 
        user: state.user,
        token: state.token
      }),
    }
  )
);

// Hook auxiliar para verificar se o usuário é admin
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
};

// Inicialização - Verificar o token no localStorage ao carregar a aplicação
export const initializeAuth = async () => {
  const auth = useAuth.getState();
  const token = localStorage.getItem('token');
  
  if (token && !auth.token) {
    auth.setToken(token);
    await auth.checkAuth();
  }
};