import { User, UserFormData } from '../types';
import { Users } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingUser: User | null;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

const UserModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingUser, 
  formData, 
  setFormData 
}: UserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1C2E] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-fade-in-scale">
        <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
          <Users className="mr-2 text-yellow-500" />
          Editar Usuário: {editingUser?.username}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Saldo</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
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
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;