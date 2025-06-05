import React from 'react';
import { Check, Loader, Copy, ArrowDownToLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PixQRCodeStepProps {
  pixData: any;
  qrCodeImage: string;
  isCheckingStatus: boolean;
  paymentStatus: string | null;
}

const PixQRCodeStep: React.FC<PixQRCodeStepProps> = ({
  pixData,
  qrCodeImage,
  isCheckingStatus,
  paymentStatus
}) => {
  const handleCopyCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      toast.success('Código PIX copiado!', {
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#ECFDF5',
          background: '#059669',
        },
        iconTheme: {
          primary: '#ECFDF5',
          secondary: '#059669',
        },
      });
    }
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {paymentStatus === 'COMPLETED' ? (
        <motion.div 
          className="flex flex-col items-center text-center"
          key="success"
          variants={successVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-400 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: { 
                scale: 1, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2
                }
              }
            }}
          >
            <Check size={36} className="text-white" />
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            Pagamento Confirmado!
          </motion.h3>
          
          <motion.p 
            className="text-slate-400 mb-4"
            variants={itemVariants}
          >
            Seu saldo foi atualizado automaticamente.
          </motion.p>
          
          <motion.div 
            className="px-4 py-3 bg-green-500/10 rounded-xl text-green-400 font-medium border border-green-500/30"
            variants={itemVariants}
          >
            Aproveite seus jogos favoritos!
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center"
          key="qrcode"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-6 rounded-2xl mb-5 shadow-lg border-8 border-slate-800"
            variants={itemVariants}
          >
            {qrCodeImage ? (
              <img 
                src={qrCodeImage} 
                alt="QR Code PIX" 
                className="w-56 h-56 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg">
                <p className="text-slate-400 text-center">QR Code indisponível</p>
              </div>
            )}
          </motion.div>
          
          {isCheckingStatus && (
            <motion.div 
              className="flex items-center justify-center text-amber-400 mb-4"
              variants={itemVariants}
            >
              <Loader size={18} className="animate-spin mr-2" />
              <span className="text-sm font-medium">Aguardando confirmação...</span>
            </motion.div>
          )}
          
          <motion.div 
            className="w-full mb-5 bg-slate-800/70 rounded-xl overflow-hidden border border-slate-700/50"
            variants={itemVariants}
          >
            <div className="bg-slate-800 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
              <p className="text-slate-300 text-sm font-medium">Código PIX Copia e Cola</p>
              <motion.button
                onClick={handleCopyCode}
                className="text-slate-400 hover:text-slate-300 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Copy size={14} />
              </motion.button>
            </div>
            <div className="p-4">
              <p className="text-slate-300 text-sm font-mono break-all bg-slate-900/70 p-3 rounded-lg">
                {pixData?.qr_code || 'Código não disponível'}
              </p>
            </div>
          </motion.div>
          
          <motion.div className="w-full grid grid-cols-2 gap-3" variants={itemVariants}>
            <motion.button
              onClick={handleCopyCode}
              className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-medium border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Copy size={16} />
              <span>Copiar Código</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                if (qrCodeImage) {
                  const link = document.createElement('a');
                  link.href = qrCodeImage;
                  link.download = 'pix-qrcode.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('QR Code salvo!');
                }
              }}
              className="flex items-center justify-center gap-2 py-3 bg-green-500/10 hover:bg-green-500/20 rounded-xl text-green-400 font-medium border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!qrCodeImage}
            >
              <ArrowDownToLine size={16} />
              <span>Salvar QR Code</span>
            </motion.button>
          </motion.div>
          
          {/* Instruções */}
          <motion.div 
            className="w-full mt-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50"
            variants={itemVariants}
          >
            <h4 className="text-sm font-medium text-slate-300 mb-3">Como pagar com PIX:</h4>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal pl-5">
              <li>Abra o app do seu banco</li>
              <li>Escolha a opção PIX (QR Code ou Copia e Cola)</li>
              <li>Escaneie o código ou cole o texto copiado</li>
              <li>Confirme o pagamento</li>
            </ol>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PixQRCodeStep;