import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Search, 
  RefreshCw, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Gamepad2, 
  Trophy, 
  Gift,
  Wallet,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getTransactions } from  '../../lib/transactions';

interface Transaction {
  _id: string;
  id?: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BET' | 'WIN' | 'BONUS';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  externalReference?: string;
  metadata?: {
    pixTransactionId?: string;
    dateApproval?: string;
    payerInfo?: {
      name?: string;
      cpf?: string;
      bank?: string;
    }
  };
}

interface HistoryModalProps {
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filters = [
    { id: 'ALL', label: 'Todos' },
    { id: 'DEPOSIT', label: 'Depósitos' },
    { id: 'WITHDRAW', label: 'Saques' },
    { id: 'BET', label: 'Apostas' },
    { id: 'WIN', label: 'Ganhos' },
  ];

  const statusColors = {
    PENDING: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    COMPLETED: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    FAILED: 'bg-rose-500/20 text-rose-500 border-rose-500/30',
    CANCELLED: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  const typeIcons = {
    DEPOSIT: ArrowUpCircle,
    WITHDRAW: ArrowDownCircle,
    BET: Gamepad2,
    WIN: Trophy,
    BONUS: Gift
  };

  const fetchTransactions = async (page = 1, filter = activeFilter, term = searchTerm) => {
    try {
      setLoading(true);
      // Preparar parâmetros para a API
      const params: {
        page: number;
        limit: number;
        type?: string;
        status?: string;
      } = {
        page,
        limit: 10,
      };

      // Adicionar filtro de tipo se não for "ALL"
      if (filter !== 'ALL') {
        params.type = filter;
      }

      // Fazer a requisição à API
      const response = await getTransactions(params);
      
      // Verificar o formato da resposta e extrair os dados corretamente
      if (response.data) {
        // A API está retornando os dados no campo "data"
        setTransactions(response.data || []);
        setTotalPages(response.pages || 1);
        setCurrentPage(response.currentPage || page);
      } else if (response.transactions) {
        // Formato alternativo (se a API mudar)
        setTransactions(response.transactions || []);
        setTotalPages(response.pages || 1);
        setCurrentPage(page);
      } else {
        // Formato inesperado
        console.error('Formato de resposta inesperado:', response);
        setError('Formato de resposta inesperado da API.');
        setTransactions([]);
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Não foi possível carregar as transações. Tente novamente.');
      setTransactions([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    fetchTransactions(1, filter);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchTransactions(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(1, activeFilter, searchTerm);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions(currentPage, activeFilter, searchTerm);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }) + ' ' + 
    date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-800/50 flex flex-col relative"
        style={{maxWidth: "420px"}}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Histórico de Transações
            </h2>
            {isRefreshing && (
              <RefreshCw size={18} className="text-slate-400 animate-spin" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!isSearchOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
              >
                <Search size={18} />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>
        
        {/* Search Bar (Conditional) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
              onSubmit={handleSearch}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 px-10 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-slate-600 placeholder-slate-400"
                />
                <Search className="absolute left-3 text-slate-400" size={18} />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 text-slate-400 hover:text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((filter) => {
            const FilterIcon = filter.id === 'ALL' ? Wallet :
                              filter.id === 'DEPOSIT' ? ArrowUpCircle :
                              filter.id === 'WITHDRAW' ? ArrowDownCircle :
                              filter.id === 'BET' ? Gamepad2 : Trophy;
            
            return (
              <motion.button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === filter.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-900/20"
                  : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                }`}
              >
                <FilterIcon size={16} />
                {filter.label}
              </motion.button>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-auto custom-scrollbar">
          {loading && !isRefreshing ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400">Carregando transações...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl mb-4 inline-flex">
                <X size={24} />
              </div>
              <p className="text-slate-300 mb-2">{error}</p>
              <button 
                onClick={() => fetchTransactions()} 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
               <motion.div
  key={transaction._id || transaction.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.01 }}
  className="flex items-center justify-between p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl hover:bg-slate-800/60 transition-all duration-200"
>
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
      {(() => {
        const IconComponent = typeIcons[transaction.type] || Wallet;
        return <IconComponent size={18} className="text-slate-300" />;
      })()}
    </div>
    
    <div>
      <h3 className="font-medium text-white">
        {transaction.type === 'DEPOSIT' && 'Depósito'}
        {transaction.type === 'WITHDRAW' && 'Saque'}
        {transaction.type === 'BET' && 'Aposta'}
        {transaction.type === 'WIN' && 'Ganho'}
        {transaction.type === 'BONUS' && 'Bônus'}
      </h3>
      
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(transaction.createdAt)}
        </span>
        {transaction.paymentMethod && (
          <>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{transaction.paymentMethod}</span>
          </>
        )}
      </div>
      
      {/* Layout para chave PIX no formato da imagem compartilhada */}
      {transaction.type === 'WITHDRAW' && transaction.metadata?.pixKey && (
        <div className="mt-1.5 flex flex-col text-xs">
          <div className="flex items-center">
            <span className="text-blue-400 font-medium">Chave PIX:</span>
            <span className="ml-1.5 text-slate-300">{transaction.metadata.pixKey}</span>
          </div>
          {transaction.metadata?.pixKeyType && (
            <div className="text-slate-400">
              Tipo: <span className="text-slate-300 capitalize">{transaction.metadata.pixKeyType.toLowerCase()}</span>
            </div>
          )}
        </div>
      )}
      
      {transaction.metadata?.pixTransactionId && (
        <div className="text-xs text-slate-400 mt-1">
          ID: {transaction.externalReference?.substring(0, 15)}...
        </div>
      )}
    </div>
  </div>
  
  <div className="flex flex-col items-end">
    <span className={`text-lg font-medium ${
      transaction.type === 'DEPOSIT' || transaction.type === 'WIN' || transaction.type === 'BONUS'
        ? 'text-emerald-400'
        : 'text-rose-400'
    }`}>
      {transaction.type === 'DEPOSIT' || transaction.type === 'WIN' || transaction.type === 'BONUS'
        ? '+'
        : '-'
      }
      {formatCurrency(transaction.amount)}
    </span>
    <span className={`text-xs px-2 py-0.5 mt-1 border rounded-full ${statusColors[transaction.status]} flex items-center gap-1`}>
      {(() => {
        const StatusIcon = transaction.status === 'PENDING' ? Clock :
                           transaction.status === 'COMPLETED' ? CheckCircle :
                           transaction.status === 'FAILED' ? XCircle : AlertCircle;
        return <StatusIcon size={12} />;
      })()}
      {transaction.status === 'PENDING' && 'Pendente'}
      {transaction.status === 'COMPLETED' && 'Concluído'}
      {transaction.status === 'FAILED' && 'Falhou'}
      {transaction.status === 'CANCELLED' && 'Cancelado'}
    </span>
  </div>
</motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-10 h-64"
            >
              <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center mb-4">
                <Wallet size={24} className="text-slate-400" />
              </div>
              <h3 className="text-slate-300 text-lg font-medium mb-1">Nenhuma transação encontrada</h3>
              <p className="text-slate-500 max-w-sm mb-4">
                {activeFilter !== 'ALL'
                  ? `Não encontramos ${activeFilter === 'DEPOSIT' 
                     ? 'depósitos' 
                     : activeFilter === 'WITHDRAW' 
                     ? 'saques' 
                     : activeFilter === 'BET' 
                     ? 'apostas' 
                     : 'ganhos'} no seu histórico.`
                  : 'Seu histórico de transações está vazio.'}
              </p>
              
              {activeFilter !== 'ALL' && (
                <button
                  onClick={() => handleFilterChange('ALL')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-colors"
                >
                  Ver todas as transações
                </button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Pagination */}
        {transactions.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-slate-800/50">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              &larr;
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Lógica para mostrar páginas ao redor da página atual
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageToShow)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    currentPage === pageToShow
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              &rarr;
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HistoryModal;