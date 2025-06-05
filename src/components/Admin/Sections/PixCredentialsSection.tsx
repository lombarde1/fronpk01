import { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import { PixCredential, PixFormData } from '../types';
import PixModal from '../Modals/PixModal';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../UI/LoadingSpinner';

const PixCredentialsSection = () => {
  const [pixCredentials, setPixCredentials] = useState<PixCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPixModal, setShowPixModal] = useState(false);
  const [editingCredential, setEditingCredential] = useState<PixCredential | null>(null);
  const [pixForm, setPixForm] = useState<PixFormData>({
    name: 'principal',
    baseUrl: 'https://api.pixupbr.com',
    clientId: '',
    clientSecret: '',
    webhookUrl: 'https://linkdasuaapi/api/pix/webhook',
    provider: 'PixUp',
    isActive: true
  });

  useEffect(() => {
    loadPixCredentials();
  }, []);

  const loadPixCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/pix-credentials');
      setPixCredentials(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar credenciais PIX:', error);
      toast.error('Erro ao carregar credenciais PIX');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePixSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCredential) {
        const credentialId = editingCredential._id || editingCredential.id;
        await api.put(`/api/pix-credentials/${credentialId}`, pixForm);
        toast.success('Credencial PIX atualizada com sucesso!');
      } else {
        await api.post('/api/pix-credentials', pixForm);
        toast.success('Credencial PIX criada com sucesso!');
      }
      
      setShowPixModal(false);
      setEditingCredential(null);
      setPixForm({
        name: 'principal',
        baseUrl: 'https://api.pixupbr.com',
        clientId: '',
        clientSecret: '',
        webhookUrl: 'https://linkdasuaapi/api/pix/webhook',
        provider: 'Pixup',
        isActive: true
      });
      loadPixCredentials();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao salvar credencial PIX';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="bg-[#0F1C2E] rounded-xl p-6 shadow-xl border border-gray-800/50">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingCredential(null);
            setPixForm({
              name: 'principal',
              baseUrl: 'https://api.pixupbr.com',
              clientId: '',
              clientSecret: '',
              webhookUrl: 'https://linkdasuaapi/api/pix/webhook',
              provider: 'Pixup',
              isActive: true
            });
            setShowPixModal(true);
          }}
          className="flex items-center space-x-2 px-5 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          <span className="font-medium">Nova Credencial PIX</span>
        </button>
      </div>
      
      {isLoading ? (
        <LoadingSpinner message="Carregando credenciais PIX..." />
      ) : (
        <>
          {pixCredentials.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl">Nenhuma credencial PIX encontrada</p>
              <p className="mt-2">Clique no botão "Nova Credencial PIX" para adicionar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 px-3">Nome</th>
                    <th className="pb-3 px-3">Provedor</th>
                    <th className="pb-3 px-3">URL Base</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pixCredentials.map((credential) => (
                    <tr key={credential._id || credential.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                      <td className="py-3 px-3">{credential.name}</td>
                      <td className="py-3 px-3">{credential.provider}</td>
                      <td className="py-3 px-3">{credential.baseUrl}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          credential.isActive
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {credential.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            setEditingCredential(credential);
                            setPixForm({
                              name: credential.name,
                              baseUrl: credential.baseUrl,
                              clientId: credential.clientId,
                              clientSecret: '',
                              webhookUrl: credential.webhookUrl,
                              provider: credential.provider,
                              isActive: credential.isActive
                            });
                            setShowPixModal(true);
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <PixModal 
        isOpen={showPixModal}
        onClose={() => {
          setShowPixModal(false);
          setEditingCredential(null);
        }}
        onSubmit={handlePixSubmit}
        editingCredential={editingCredential}
        formData={pixForm}
        setFormData={setPixForm}
      />
    </div>
  );
};

export default PixCredentialsSection;