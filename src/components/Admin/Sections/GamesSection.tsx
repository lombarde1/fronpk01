import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { Game, GameFormData } from '../types';
import GameModal from '../Modals/GameModal';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../UI/LoadingSpinner';

const GamesSection = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameForm, setGameForm] = useState<GameFormData>({
    name: '',
    imageUrl: '',
    provider: '',
    category: '',
    minBet: 1,
    maxBet: 1000,
    rtp: 95,
    isFeatured: false,
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/games');
      setGames(response.data.games || []);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      toast.error('Erro ao carregar jogos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await api.put(`/api/games/${editingGame._id}`, gameForm);
        toast.success('Jogo atualizado com sucesso!');
      } else {
        await api.post('/api/games', gameForm);
        toast.success('Jogo adicionado com sucesso!');
      }
      
      setShowGameModal(false);
      setEditingGame(null);
      setGameForm({
        name: '',
        imageUrl: '',
        provider: '',
        category: '',
        minBet: 1,
        maxBet: 1000,
        rtp: 95,
        isFeatured: false
      });
      loadGames();
    } catch (error) {
      toast.error('Erro ao salvar jogo');
    }
  };

  const toggleGameStatus = async (game: Game) => {
    try {
      await api.put(`/api/games/${game._id}`, {
        ...game,
        isActive: !game.isActive
      });
      toast.success(`Jogo ${game.isActive ? 'desativado' : 'ativado'} com sucesso!`);
      loadGames();
    } catch (error) {
      toast.error('Erro ao atualizar status do jogo');
    }
  };

  return (
    <div className="bg-[#0F1C2E] rounded-xl p-6 shadow-xl border border-gray-800/50">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingGame(null);
            setGameForm({
              name: '',
              imageUrl: '',
              provider: '',
              category: '',
              minBet: 1,
              maxBet: 1000,
              rtp: 95,
              isFeatured: false
            });
            setShowGameModal(true);
          }}
          className="flex items-center space-x-2 px-5 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} />
          <span className="font-medium">Novo Jogo</span>
        </button>
      </div>
      
      {isLoading ? (
        <LoadingSpinner message="Carregando jogos..." />
      ) : (
        <>
          {games.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl">Nenhum jogo encontrado</p>
              <p className="mt-2">Clique no botão "Novo Jogo" para adicionar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game._id}
                  className="bg-[#1A2634] rounded-xl overflow-hidden border border-gray-800/30 transition-all hover:shadow-xl hover:shadow-yellow-500/5 hover:border-gray-700 game-card"
                >
                  <div className="relative">
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="w-full h-48 object-cover"
                    />
                    {game.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md">
                        Destaque
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold ${
                      game.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {game.isActive ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{game.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {game.provider} • {game.category}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
                      <div>Min: R$ {game.minBet}</div>
                      <div>Max: R$ {game.maxBet}</div>
                      <div>RTP: {game.rtp}%</div>
                      <div>Pop: {game.popularity || 0}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingGame(game);
                          setGameForm({
                            name: game.name,
                            imageUrl: game.imageUrl,
                            provider: game.provider,
                            category: game.category,
                            minBet: game.minBet,
                            maxBet: game.maxBet,
                            rtp: game.rtp,
                            isFeatured: game.isFeatured
                          });
                          setShowGameModal(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => toggleGameStatus(game)}
                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          game.isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {game.isActive ? (
                          <>
                            <EyeOff size={16} />
                            <span>Desativar</span>
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            <span>Ativar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <GameModal 
        isOpen={showGameModal}
        onClose={() => {
          setShowGameModal(false);
          setEditingGame(null);
        }}
        onSubmit={handleGameSubmit}
        editingGame={editingGame}
        formData={gameForm}
        setFormData={setGameForm}
      />
    </div>
  );
};

export default GamesSection;