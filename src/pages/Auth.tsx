import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, Zap, User, Mail, Phone, CreditCard, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { getGames, Game } from '../lib/games';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [games, setGames] = useState([]);
  const { setToken, checkAuth } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await api.get('/api/games');
        setGames(response.data.games || []);
      } catch (error) {
        console.error('Error loading games:', error);
      }
    };
    loadGames();
    
    // Auto rotate featured items
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username.match(/^[a-zA-Z0-9_]{3,30}$/)) {
      toast.error('Nome de usuário inválido. Use apenas letras, números e _ (3-30 caracteres)');
      setLoading(false);
      return;
    }

    const handleAuthResponse = (response) => {
      if (response.data?.success && response.data?.data?.token) {
        setToken(response.data.data.token);
        return true;
      }
      throw new Error('Erro na autenticação');
    };

    try {
      if (isLogin) {
        const response = await api.post('/api/auth/login', { username, password });
        const success = handleAuthResponse(response);
        if (success) await checkAuth();
      } else {
        const response = await api.post('/api/auth/register', {
          username,
          email,
          password,
          fullName,
          phone,
          cpf
        });
        const success = handleAuthResponse(response);
        if (success) await checkAuth();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao processar requisição';
      toast.error(errorMessage);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Trophy,
      title: "Prêmios Garantidos",
      description: "Os melhores prêmios e odds do mercado",
      color: "from-amber-500 to-yellow-500",
      shadow: "shadow-amber-500/20"
    },
    {
      icon: Zap,
      title: "Pagamento Instantâneo",
      description: "Receba seus ganhos na hora",
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20"
    },
    {
      icon: Coins,
      title: "Bônus de Boas-vindas",
      description: "Ganhe bônus no seu primeiro depósito",
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20"
    }
  ];

  // 3D card tilt effect
  const cardVariants = {
    hover: {
      rotateY: 5,
      rotateX: -5,
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  // Staggered animation for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B1622] to-[#0F1C2E]">
      {/* Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10" />
        
        {/* Glowing orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50 + "%", 
              y: Math.random() * 100 - 50 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              x: [
                Math.random() * 100 - 50 + "%", 
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%"
              ],
              y: [
                Math.random() * 100 - 50 + "%", 
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%"
              ]
            }}
            transition={{ 
              duration: 20 + Math.random() * 30, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 ${
              i % 3 === 0 ? 'bg-amber-500' : 
              i % 3 === 1 ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          />
        ))}
        
        {/* Games grid */}
        <div className="absolute inset-0 grid grid-cols-4 gap-4 transform -rotate-12 scale-125 opacity-10 z-0">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ y: index % 2 === 0 ? -1000 : 1000 }}
              animate={{ y: index % 2 === 0 ? 1000 : -1000 }}
              transition={{
                duration: 12 + Math.random() * 6,
                repeat: Infinity,
                ease: "linear",
                delay: -Math.random() * 20
              }}
              className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={game.imageUrl || `https://source.unsplash.com/random/300x400?game=${index}`}
                alt={game?.name || "Game"}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 relative z-20">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            variants={cardVariants}
            whileHover="hover"
            className="w-full max-w-md space-y-8 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/50 shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto w-full max-w-[220px] mb-6"
              >
                <img
                  src="https://i.imgur.com/b3oH08A.png"
                  alt="Logo"
                  className="w-full h-auto drop-shadow-lg rounded-xl"
                />
              </motion.div>
              
              <motion.h2 
                className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </motion.h2>
              
              <motion.p 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-2 text-lg text-slate-400"
              >
                {isLogin
                  ? 'Entre para começar a apostar'
                  : 'Registre-se para começar sua jornada'}
              </motion.p>
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="mt-8 space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={containerVariants} className="space-y-4">
                {!isLogin && (
                  <motion.div variants={itemVariants} className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                      placeholder="Nome completo"
                    />
                  </motion.div>
                )}
                
                {!isLogin && (
                  <>
                    <motion.div variants={itemVariants} className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                        placeholder="Email"
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                        placeholder="Telefone (ex: 11999999999)"
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="relative">
                      <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                        placeholder="CPF (apenas números)"
                      />
                    </motion.div>
                  </>
                )}
                
                <motion.div variants={itemVariants} className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                    placeholder="Nome de usuário (letras, números e _)"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                    placeholder="Sua senha"
                  />
                </motion.div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-lg font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-600/20 focus:outline-none transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar' : 'Criar conta'}</span>
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              <motion.div 
                variants={itemVariants}
                className="text-center pt-2"
              >
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-amber-400 hover:text-amber-300 transition-colors text-sm md:text-base font-medium"
                >
                  {isLogin
                    ? 'Não tem uma conta? Registre-se'
                    : 'Já tem uma conta? Entre'}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:block w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-lg mx-auto"
          >
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-4xl xl:text-5xl font-bold text-white mb-12 text-center"
            >
              A melhor <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">casa de apostas</span> online
            </motion.h2>
            
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={`p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/50 shadow-xl ${
                    activeFeature === index ? `shadow-lg ${feature.shadow}` : ''
                  } transition-all duration-300`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 rounded-xl p-3 bg-gradient-to-br ${feature.color}`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        activeFeature === index 
                          ? `bg-clip-text text-transparent bg-gradient-to-r ${feature.color}` 
                          : 'text-white'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Testimonial */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-12 p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/50 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <div className="font-medium text-white">Marcos S.</div>
                  <div className="text-slate-400 text-sm">Ganhou R$ 12.540 ontem</div>
                </div>
              </div>
              <p className="mt-4 text-slate-300 italic">
                "Melhor plataforma de apostas que já utilizei. Pagamento rápido e interface incrível!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}