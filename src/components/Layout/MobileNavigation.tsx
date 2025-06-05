import React, { useState } from 'react';
import { Wallet, ArrowDown, Clock, LogOut } from 'lucide-react';

const MobileNavigation = ({ 
  onDepositClick, 
  onWithdrawClick, 
  onHistoryClick, 
  onLogoutClick 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleClick = (index, callback) => {
    setActiveTab(index);
    callback();
  };

  const navItems = [
    { icon: Wallet, label: "Depositar", onClick: onDepositClick, color: "bg-gradient-to-r from-amber-400 to-amber-500" },
    { icon: ArrowDown, label: "Sacar", onClick: onWithdrawClick, color: "bg-gradient-to-r from-indigo-400 to-blue-500" },
    { icon: Clock, label: "Histórico", onClick: onHistoryClick, color: "bg-gradient-to-r from-emerald-400 to-teal-500" },
    { icon: LogOut, label: "Sair", onClick: onLogoutClick, color: "bg-gradient-to-r from-rose-400 to-red-500" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900/90 backdrop-blur-xl z-50 pb-6 pt-2 px-4 border-t border-slate-800/50 shadow-lg">
      {/* Indicator line - moves based on active tab */}
      <div className="absolute top-0 left-0 right-0 h-0.5 flex justify-around">
        <div 
          className="h-full w-1/4 transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(${activeTab * 100}%)`,
            background: "linear-gradient(to right, #60a5fa, #3b82f6)",
            width: "25%",
            borderRadius: "0 0 4px 4px",
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
          }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(index, item.onClick)}
            className={`relative flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out ${
              activeTab === index ? "transform -translate-y-1" : ""
            }`}
          >
            {/* Interactive background */}
            <div 
              className={`absolute inset-0 rounded-xl opacity-0 ${
                activeTab === index ? "opacity-10" : ""
              } ${item.color} transition-opacity duration-300`}
            />
            
            {/* Icon with dynamic effect */}
            <div 
              className={`relative flex items-center justify-center w-10 h-10 mb-1 rounded-xl ${
                activeTab === index 
                ? `${item.color} text-white shadow-lg` 
                : "bg-slate-800/70 text-slate-400"
              } transition-all duration-300`}
            >
              <item.icon 
                size={activeTab === index ? 20 : 18} 
                className="transition-all duration-300"
              />
              
              {/* Active state glow effect */}
              {activeTab === index && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-subtle" />
              )}
            </div>
            
            {/* Label */}
            <span 
              className={`text-xs font-medium transition-all duration-300 ${
                activeTab === index 
                ? "text-white" 
                : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Add a subtle animation for the active pulse */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0% { opacity: 0.2; }
          50% { opacity: 0.3; }
          100% { opacity: 0.2; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default MobileNavigation;