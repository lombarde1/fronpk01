import { Game, GameFormData } from '../types';
import { GamepadIcon } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingGame: Game | null;
  formData: GameFormData;
  setFormData: (data: GameFormData) => void;
}

const GameModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingGame, 
  formData, 
  setFormData 
}: GameModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1C2E] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl animate-fade-in-scale">
        <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
          <GamepadIcon className="mr-2 text-yellow-500" />
          {editingGame ? 'Editar Jogo' : 'Novo Jogo'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Nome</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-300">URL da Imagem</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Aposta Mínima</label>
              <input
                type="number"
                required
                min="1"
                value={formData.minBet}
                onChange={(e) =>
                  setFormData({ ...formData, minBet: Number(e.target.value) })
                }
                className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Aposta Máxima</label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxBet}
                onChange={(e) =>
                  setFormData({ ...formData, maxBet: Number(e.target.value) })
                }
                className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">RTP (%)</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.rtp}
              onChange={(e) =>
                setFormData({ ...formData, rtp: Number(e.target.value) })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div className="flex items-center space-x-2 p-3 bg-[#1A2634] rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-white">
              Destacar na página inicial
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Provedor</label>
            <input
              type="text"
              required
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Categoria</label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#1A2634] border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            >
              <option value="">Selecione uma categoria</option>
              <option value="slots">Slots</option>
              <option value="table">Mesa</option>
              <option value="live">Ao Vivo</option>
              <option value="crash">Crash</option>
              <option value="sport">Esportes</option>
              <option value="other">Outros</option>
            </select>
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
              {editingGame ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameModal;