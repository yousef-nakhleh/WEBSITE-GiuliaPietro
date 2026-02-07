import React, { useEffect, useRef } from 'react';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { User } from '@supabase/supabase-js'; 

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  signOut: () => Promise<void>;
  navigate: (path: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, user, signOut, navigate }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await signOut();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto">
      {/* Mobile backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t auth-border-color md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:w-64 md:rounded-lg md:border md:mt-2"
      >
        {/* Header */}
        <div className="p-6 border-b auth-border-color">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-semibold text-black truncate">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Utente'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button
            onClick={() => {
              navigate('/areapersonale/appuntamenti');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 auth-font-primary">I miei appuntamenti</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="auth-font-primary">Logout</span>
          </button>
        </div>

        {/* Mobile close handle */}
        <div className="md:hidden p-4 text-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>
      </div> 
    </div>
  );
};

export default UserMenu; 
