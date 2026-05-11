import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Home, Search, Package, User, LogOut, Shield } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/cards', label: 'Cards', icon: Search },
    ...(isAuthenticated
      ? [
          { to: '/inventory', label: 'Inventory', icon: Package },
          { to: '/profile', label: 'Profile', icon: User },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin', icon: Shield }]
      : []),
  ];

  return (
    <nav className="bg-canvas border-b border-subtle-gray sticky top-0 z-40 backdrop-blur-sm bg-canvas/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-shop-violet font-bold text-xl tracking-tight group-hover:scale-105 transition-transform duration-200">
              ANZU
            </span>
            <span className="text-ink-black text-sm font-medium hidden sm:block">Inventory</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-[22.8092px] text-body-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-shop-violet text-white shadow-[0px_4px_24px_rgba(69,36,219,0.25)]'
                      : 'text-muted-text hover:text-ink-black hover:bg-subtle-gray active:scale-[0.97]'
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-muted-text hidden sm:block font-medium">
                  {user?.username}
                </span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="flex items-center gap-2 text-muted-text hover:text-ink-black"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-text hover:text-ink-black">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-white">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-subtle-gray overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-3 gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'bg-shop-violet text-white shadow-[0px_4px_16px_rgba(69,36,219,0.25)]'
                    : 'text-muted-text hover:text-ink-black hover:bg-subtle-gray active:scale-[0.97]'
                )}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}