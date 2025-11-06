import { LogOut, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <FolderKanban className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Dev Planner</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Olá, {user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
