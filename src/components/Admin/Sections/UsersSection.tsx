import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { User, UserFormData } from '../types';
import UserModal from '../Modals/UserModal';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../UI/LoadingSpinner';

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    balance: 0,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${editingUser?._id}`, {
        name: userForm.name,
        balance: userForm.balance
      });
      toast.success('Usuário atualizado com sucesso!');
      setShowUserModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  return (
    <div className="bg-[#0F1C2E] rounded-xl p-6 shadow-xl border border-gray-800/50">
      {isLoading ? (
        <LoadingSpinner message="Carregando usuários..." />
      ) : (
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 px-3">Usuário</th>
                  <th className="pb-3 px-3">Nome</th>
                  <th className="pb-3 px-3">Email</th>
                  <th className="pb-3 px-3">Saldo</th>
                  <th className="pb-3 px-3">Data de Cadastro</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="py-3 px-3">{user.username}</td>
                    <td className="py-3 px-3">{user.name}</td>
                    <td className="py-3 px-3">{user.email}</td>
                    <td className="py-3 px-3">R$ {user.balance?.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setUserForm({
                            name: user.name,
                            balance: user.balance
                          });
                          setShowUserModal(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Pencil size={14} />
                        <span>Editar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <UserModal 
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        editingUser={editingUser}
        formData={userForm}
        setFormData={setUserForm}
      />
    </div>
  );
};

export default UsersSection;