import { Users, GamepadIcon, Key } from 'lucide-react';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminTabs = ({ activeTab, setActiveTab }: AdminTabsProps) => {
  const tabs = [
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'games', label: 'Jogos', icon: GamepadIcon },
    { id: 'pix', label: 'Token PIX', icon: Key }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 transform scale-105'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AdminTabs;