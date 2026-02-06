import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthButtonProps {
  isMobile?: boolean;
  onOpenLoginModal: () => void;
  onOpenUserMenu: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isMobile = false, onOpenLoginModal, onOpenUserMenu }) => {
  const { user } = useAuth();

  console.log('🔍 AuthButton render - user:', user?.email || 'null');

  const handleUserIconClick = () => {
    if (user) {
      onOpenUserMenu();
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <button
      onClick={handleUserIconClick}
      className="text-black hover:text-gold transition-colors"
      title={user ? 'Account' : 'Login'}
    >
      {user ? <UserIcon size={24} /> : <span className="text-sm">Login</span>}
    </button>
  );
};

export default AuthButton; 
