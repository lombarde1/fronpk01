import { PixCredential, PixFormData } from '../types';
import { Key } from 'lucide-react';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCredential: PixCredential | null;
  formData: PixFormData;
  setFormData: (data: PixFormData) => void;
}

const PixModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingCredential, 
  formData, 
  setFormData 
}: PixModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1C2E] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-fade-in-scale">
        <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
          <Key className="mr-2 text-yellow-500" />
          {editingCredential ? 'Editar Credencial PIX' : 'Nova Credencial PIX'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">URL Base</label>
            <input
              type="url"
              required
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Client ID</label>
            <input
              type="text"
              required
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Client Secret {editingCredential && '(deixe em branco para manter o atual)'}
            </label>
            <input
              type="password"
              required={!editingCredential}
              value={formData.clientSecret}
              onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">URL do Webhook</label>
            <input
              type="url"
              required
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Provedor</label>
            <select
              required
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            >
              <option value="">Selecione um provedor</option>
              <option value="pixup">PixUp</option>
              <option value="asaas">Asaas</option>
              <option value="mercadopago">Mercado Pago</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-[#1A2634] rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-white">
              Ativar esta credencial
            </label>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
            >
              {editingCredential ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PixModal;