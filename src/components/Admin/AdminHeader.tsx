import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0F1C2E] border-b border-gray-800 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors rounded-full p-2 hover:bg-gray-800"
              aria-label="Voltar para o início"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;