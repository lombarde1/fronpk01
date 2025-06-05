import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth, useIsAdmin } from '../hooks/useAuth';

// Componentes de layout
import AdminHeader from '../components/Admin/AdminHeader';
import AdminTabs from '../components/Admin/AdminTabs';

// Componentes de seções
import UsersSection from '../components/Admin/Sections/UsersSection';
import GamesSection from '../components/Admin/Sections/GamesSection';
import PixCredentialsSection from '../components/Admin/Sections/PixCredentialsSection';

// Importar estilos
import '../styles/admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const isAdmin = useIsAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Verifica se o usuário tem permissão de admin
  const checkAdminAccess = async () => {
    try {
      setIsLoading(true);
      
      // Atualiza os dados do usuário
      await refreshUserData();
      
      // Verifica se o usuário é admin
      if (!isAdmin) {
        toast.error('Acesso não autorizado. É necessário ser um administrador para acessar esta página.');
        navigate('/');
        return;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      toast.error('Erro ao verificar permissões');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1622] text-white">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-xl font-medium">Carregando painel administrativo...</span>
          </div>
        </div>
      ) : (
        <>
          <AdminHeader />
          
          <main className="max-w-7xl mx-auto px-4 py-6">
            <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === 'users' && <UsersSection />}
            {activeTab === 'games' && <GamesSection />}
            {activeTab === 'pix' && <PixCredentialsSection />}
          </main>
        </>
      )}
    </div>
  );
}