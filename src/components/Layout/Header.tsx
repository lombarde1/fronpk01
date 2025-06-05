import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Search, Bell, Gift, User, Menu, Star, MenuSquare, Trophy, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onDepositClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onDepositClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Atualiza o horário atual
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(timer);
  }, []);

  // Fecha os modais ao clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Fecha o menu móvel quando clica fora
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(target) && !target.closest('.menu-toggle-btn')) {
        setIsMenuOpen(false);
      }
      
      // Fecha as notificações quando clica fora
      if (isNotificationOpen && notificationRef.current && !notificationRef.current.contains(target) && !target.closest('.notification-toggle-btn')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isNotificationOpen]);

  // Navegação para a página de jogos filtrada por categoria
  const handleGameCategoryClick = (category: string) => {
    navigate(`/games?category=${category}`);
    setIsMenuOpen(false); // Fecha o menu após seleção
  };

  // Formata a hora no formato HH:MM
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Formata o primeiro nome do usuário
  const firstName = 'Apostador Iniciante';

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior com informações rápidas */}
      <div className="bg-gray-900 text-gray-200 py-1 px-4 text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-purple-400" />
            <span>{formattedTime}</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Trophy size={12} className="text-yellow-400" />
            <span>Prêmios disponíveis: R$ 1.450.000</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://t.me/suportepeakbetbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Suporte
          </a>
          <a 
            href="https://t.me/+Ebms_T0M2II2YzZh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Nosso grupo Oficial!
          </a>
        </div>
      </div>
      
      {/* Header principal com gradiente */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo e hamburger menu para mobile */}
          <div className="flex items-center gap-2">
            <button 
              className="mr-2 md:hidden menu-toggle-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} className="text-white" />
            </button>
            <img 
              src="https://i.ibb.co/TDSkw7xY/logo.png" 
              alt="PeakBET Logo" 
              className="h-10 md:h-12 drop-shadow cursor-pointer" 
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Menu principal - visível em telas médias e grandes */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <button 
              onClick={() => handleGameCategoryClick('Todos')}
              className="text-white font-medium hover:text-yellow-300 transition-colors flex items-center gap-1"
            >
              <MenuSquare size={16} />
              <span>Todos</span>
            </button>
            <button 
              onClick={() => handleGameCategoryClick('Slots')}
              className="text-white font-medium hover:text-yellow-300 transition-colors flex items-center gap-1"
            >
              <Star size={16} />
              <span>Slots</span>
            </button>
            <button 
              onClick={() => handleGameCategoryClick('Cassino')}
              className="text-white font-medium hover:text-yellow-300 transition-colors"
            >
              Cassino
            </button>
            <button 
              onClick={() => handleGameCategoryClick('Esportes')}
              className="text-white font-medium hover:text-yellow-300 transition-colors"
            >
              Esportes
            </button>
            <button 
              onClick={() => handleGameCategoryClick('Arcade')}
              className="text-white font-medium hover:text-yellow-300 transition-colors"
            >
              Arcade
            </button>
          </nav>
          
          {/* Área do usuário e ações */}
          <div className="flex items-center gap-2">
            {/* Botão de busca */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white rounded-full hover:bg-purple-500 transition-colors"
            >
              <Search size={20} />
            </button>
            
            {/* Botão de notificações com indicador */}
            <div className="relative notification-container">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-white rounded-full hover:bg-purple-500 transition-colors notification-toggle-btn"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>
              
              {/* Dropdown de notificações - Ajustado para mobile e desktop */}
              {isNotificationOpen && (
                <div 
                  ref={notificationRef}
                  className="fixed md:absolute top-20 inset-x-4 md:top-auto md:inset-x-auto md:right-0 md:mt-2 w-auto md:w-80 bg-white rounded-lg shadow-xl py-2 text-gray-800 text-sm z-50 notification-panel animate-fadeIn"
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-base">Notificações</p>
                    <button 
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50">
                      <Gift size={18} className="text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Bônus de R$50 disponível!</p>
                        <p className="text-gray-500 text-xs mt-1">Há 10 minutos</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50">
                      <Trophy size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Você ganhou um giro grátis!</p>
                        <p className="text-gray-500 text-xs mt-1">Há 1 hora</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">Ver todas</a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Barra de busca - aparece quando clicado */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 bg-gray-900 p-4 shadow-lg z-50 animate-fadeIn">
                <div className="max-w-2xl mx-auto relative">
                  <input 
                    type="text" 
                    placeholder="Buscar jogos, cassinos, slots..." 
                    className="w-full py-2 px-4 pr-10 rounded-full border-2 border-purple-500 focus:outline-none focus:border-purple-600"
                    autoFocus
                  />
                  <Search size={20} className="absolute right-3 top-2.5 text-gray-500" />
                </div>
              </div>
            )}
            
            {/* Botão de promoções */}
            <a 
              href="https://t.me/+Ebms_T0M2II2YzZh"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 text-white rounded-full hover:bg-purple-500 transition-colors items-center gap-1"
            >
              <Gift size={20} />
            </a>
            
            {/* Botão de saldo/depósito */}
            <button 
              onClick={onDepositClick} 
              className="bg-white text-gray-800 font-medium rounded-full py-2 px-4 flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
            >
              <Wallet size={18} className="text-purple-600" />
              <span>R$ {user?.balance?.toFixed(2) || '0.00'}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path 
                  d="M2.5 4.5L6 8L9.5 4.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {/* Perfil do usuário */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <User size={18} />
              </div>
              <span className="text-white text-sm font-medium hidden lg:block">
              Apostador Iniciante
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu móvel - aparece quando o hamburger é clicado */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm md:hidden">
          <div 
            ref={menuRef}
            className="h-full w-72 bg-gradient-to-b from-purple-900 to-indigo-900 p-0 shadow-2xl animate-slideIn"
          >
            {/* Cabeçalho do menu móvel com informações do usuário */}
            <div className="bg-black bg-opacity-30 px-5 py-4 flex flex-col space-y-4 border-b border-purple-800">
              <div className="flex justify-between items-center">
                <img 
                  src="https://i.ibb.co/TDSkw7xY/logo.png" 
                  alt="PeakBET Logo" 
                  className="h-8" 
                />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-800 bg-opacity-50 text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Área do perfil do usuário */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <User size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Apostador Iniciante</p>
                  <p className="text-purple-200 text-sm">Saldo: R$ {user?.balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            {/* Links principais */}
            <div className="overflow-y-auto h-full pb-20">
              {/* Seção de jogos */}
              <div className="px-3 py-3">
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wider px-2 mb-2">Jogos</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => handleGameCategoryClick('Todos')}
                    className="w-full flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                      <MenuSquare size={16} className="text-white" />
                    </div>
                    <span className="font-medium">Todos os Jogos</span>
                  </button>
                  <button 
                    onClick={() => handleGameCategoryClick('Slots')}
                    className="w-full flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                      <Star size={16} className="text-white" />
                    </div>
                    <span className="font-medium">Slots</span>
                  </button>
                  <button 
                    onClick={() => handleGameCategoryClick('Cassino')}
                    className="w-full flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3.75L10 7.75L14 3.75V10.25L10 14.25L6 10.25V3.75Z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Cassino</span>
                  </button>
                
                  <button 
                    onClick={() => handleGameCategoryClick('Arcade')}
                    className="w-full flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 7H7v6h6V7z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Arcade</span>
                  </button>
                </div>
              </div>

              {/* Divisor */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-700 to-transparent my-2"></div>

              {/* Seção de recursos */}
              <div className="px-3 py-3">
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wider px-2 mb-2">Recursos</p>
                <div className="space-y-1">
                  <a 
                    href="https://t.me/+Ebms_T0M2II2YzZh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                      <Gift size={16} className="text-white" />
                    </div>
                    <span className="font-medium">Nosso Grupo Oficial</span>
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
                  </a>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDepositClick();
                    }} 
                    className="w-full flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Depósito</span>
                  </button>
                  <a 
                    href="https://t.me/suportepeakbetbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white hover:bg-purple-700 hover:bg-opacity-40 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0-8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Suporte</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Botão de depósito fixo na parte inferior */}
            <div className="fixed bottom-0 left-0 w-72 py-3 px-5 bg-black bg-opacity-50 backdrop-blur-sm border-t border-purple-800">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onDepositClick();
                }} 
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
              >
                <Wallet size={18} />
                <span>Fazer Depósito</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Estilos adicionais com keyframes para animações */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;