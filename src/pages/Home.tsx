import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { getGames } from '../lib/games';
import api from '../lib/api';

// Importação de componentes
import Header from '../components/Layout/Header';
import MobileNavigation from '../components/Layout/MobileNavigation';
import BannerCarousel from '../components/Home/BannerCarousel';
import CategoryFilter from '../components/Home/CategoryFilter';
import GameGrid from '../components/Home/GameGrid';

// Importação de modais
import GameModal from '../components/Modals/GameModal';
import DepositModal from '../components/Modals/Deposit/DepositModal';
import HistoryModal from '../components/Modals/HistoryModal';
import WithdrawModal from '../components/Modals/WithdrawModal';

// Dados estáticos
const banners = [
  "https://i.imgur.com/DLNAN9X.png",
  "https://i.imgur.com/IbyL6q3.png",
  "https://i.imgur.com/OvgYyCN.png",
  "https://i.imgur.com/7uU7LIv.png",
  'https://i.imgur.com/3BEMXs5.png'
];

const Home = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para dados
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos', 'Slots', 'Arcade']);
  
  // Estados para controle de modais
  const [showGameModal, setShowGameModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Efeito para carregar jogos e perfil do usuário
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const response = await getGames();
        setGames(response.games || []);
        
        // Extrair categorias únicas dos jogos
        if (response.games && response.games.length > 0) {
          const uniqueCategories = [...new Set(response.games.map(game => game.category))];
          setCategories(['Todos', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Error loading games:', error);
        toast.error('Erro ao carregar jogos');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try { //
        const response = await fetch("https://money2025-api01peak.krkzfx.easypanel.host/api/auth/profile", {
          headers: {
            "accept": "application/json, text/plain, */*",
            "authorization": `Bearer ${localStorage.getItem('token')}`,
          },
          method: "GET",
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Atualiza os dados do usuário no contexto de autenticação
          if (data.data.balance !== undefined && setUser && user) {
            if (user.balance !== data.data.balance) {
              // Atualiza apenas se o saldo for diferente
              setUser({
                ...user,
                balance: data.data.balance
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    loadGames();
    fetchUserProfile();
  }, [setUser, user]);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  // Filtragem de jogos por categoria
  const filteredGames = selectedCategory === 'Todos' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0F1C] to-[#141E36] text-white">
      {/* Header */}
      <Header 
        user={user} 
        onDepositClick={() => setShowDepositModal(true)} 
      />

      {/* Banner Section */}
      <BannerCarousel banners={banners} />

      {/* Categories Section */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Games Section */}
      <GameGrid 
        games={filteredGames}
        loading={loading}
        selectedCategory={selectedCategory}
        onGameClick={handleGameClick}
      />

      {/* Mobile Fixed Navigation */}
      <MobileNavigation 
        onDepositClick={() => setShowDepositModal(true)}
        onWithdrawClick={() => setWithdrawModal(true)}
        onHistoryClick={() => setShowHistoryModal(true)}
        onLogoutClick={handleLogout}
      />

      {/* Modals */}
      {showGameModal && (
        <GameModal 
          game={selectedGame}
          onClose={() => setShowGameModal(false)}
          onDepositClick={() => {
            setShowGameModal(false);
            setShowDepositModal(true);
          }}
        />
      )}

      {showDepositModal && (
        <DepositModal 
          user={user}
          setUser={setUser}
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {showHistoryModal && (
        <HistoryModal 
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {withdrawModal && (
        <WithdrawModal 
          user={user}
          onClose={() => setWithdrawModal(false)}
        />
      )}
    </div>
  );
};

export default Home;