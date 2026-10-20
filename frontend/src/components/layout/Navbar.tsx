import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home, Search, Bookmark, User, LogOut, Shield, ChevronDown, Menu, X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isManager, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/search', label: 'Search', icon: <Search size={16} /> },
    ...(isAuthenticated ? [{ to: '/my-bookings', label: 'My Trips', icon: <Bookmark size={16} /> }] : []),
    ...(isManager ? [{ to: '/admin', label: 'Admin', icon: <Shield size={16} /> }] : []),
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-black text-lg">R</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Roamify</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
                >
                  <div className="w-7 h-7 brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-24 truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Bookmark size={15} /> My Bookings
                    </Link>
                    {isManager && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to ? 'bg-rose-50 text-rose-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm flex-1">Sign In</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm flex-1">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
