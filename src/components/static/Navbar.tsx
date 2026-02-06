// src/components/static/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';
import AuthButton from '../../authentication/buttons/AuthButton';
import UserMenu from '../../authentication/buttons/UserMenu';
import LoginModal from '../../authentication/UI/LoginModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-500 border-b border-[#d4c9bc]/30 ${
        scrolled ? 'bg-[#E8E0D5] py-2' : 'bg-[#E8E0D5] py-6'
      }`}
      aria-label="Barra di navigazione principale"
      role="banner"
    >
      <div className="container mx-auto px-6">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="hidden md:flex items-center space-x-3">
            <a href="/#home" aria-label="Torna alla Home">
              <picture>
                <source srcSet="/assets/logo.webp" type="image/webp" />
                <img
                  src="/assets/logo.png"
                  alt="Logo Epifanio Di Giovanni"
                  width={120}
                  height={48}
                  loading="eager"
                  decoding="async"
                  className="h-12 object-contain"
                />
              </picture>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-black hover:text-black/70 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-12"
            role="navigation"
            aria-label="Navigazione principale"
          >
            <NavLink href="/#home">Home</NavLink>
            <NavLink href="/#servizi">Servizi</NavLink>
            <NavLink href="/#trattamenti">Trattamenti</NavLink>
            <NavLink href="/#galleria">Galleria</NavLink>
            <NavLink href="/#contatti">Contatti</NavLink>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/prenotazione/servizi')}
              className="px-6 py-2 text-sm font-semibold border border-black text-black tracking-wide hover:bg-black hover:text-white transition-all duration-300"
            >
              Prenota Ora
            </button>

            <AuthButton
              onOpenLoginModal={() => setLoginModalOpen(true)}
              onOpenUserMenu={() => setUserMenuOpen(true)}
            />
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out ${
            isOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <nav className="bg-[#E8E0D5] mt-2 p-6 rounded-lg space-y-6 shadow-xl">
            <MobileNavLink href="/#home" onClick={() => setIsOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/#servizi" onClick={() => setIsOpen(false)}>
              Servizi
            </MobileNavLink>
            <MobileNavLink href="/#trattamenti" onClick={() => setIsOpen(false)}>
              Trattamenti
            </MobileNavLink>
            <MobileNavLink href="/#galleria" onClick={() => setIsOpen(false)}>
              Galleria
            </MobileNavLink>
            <MobileNavLink href="/#contatti" onClick={() => setIsOpen(false)}>
              Contatti
            </MobileNavLink>
            
            <button
              onClick={() => {
                navigate('/prenotazione/servizi');
                setIsOpen(false);
              }}
              className="block text-center text-black text-lg tracking-widest hover:text-black/70 transition-colors duration-300 border-b border-black/10 pb-4 w-full"
            >
              Prenota Ora
            </button>

            <div className="pt-4 border-t border-black/10 flex justify-center">
              <AuthButton
                isMobile
                onOpenLoginModal={() => {
                  setLoginModalOpen(true);
                  setIsOpen(false);
                }}
                onOpenUserMenu={() => {
                  setUserMenuOpen(true);
                  setIsOpen(false);
                }}
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Global auth UI */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <UserMenu
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        user={user}
        signOut={signOut}
        navigate={navigate}
      />
    </header>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="text-black text-sm tracking-widest uppercase hover:text-black/70 transition-colors duration-300"
  >
    {children}
  </a>
);

const MobileNavLink: React.FC<{
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ href, onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    className="block text-center text-black text-lg tracking-widest hover:text-black/70 transition-colors duration-300 border-b border-black/10 pb-4"
  >
    {children}
  </a>
);

export default Navbar;