import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Bell, 
  Video, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useAlerts();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Students & Ranks', icon: Users },
    { 
      to: '/alerts', 
      label: 'Alerts', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { to: '/vision', label: 'Vision Studio', icon: Video, sublabel: 'Preview' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Academic Identity */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5 text-slate-900 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
                <GraduationCap size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-base text-slate-900">ByteNight</span>
                  <span className="text-xs px-1.5 py-0.2 font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                    EarlySupport
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Explainable Academic Support
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to));

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                  {link.sublabel && (
                    <span className="text-[10px] font-normal opacity-70 border border-current rounded px-1">
                      {link.sublabel}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right User & Class Header */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="hidden sm:flex flex-col pr-1">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight truncate max-w-[140px]">
                      {user.department}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {user.role}
                        </span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                          <ShieldCheck size={11} /> Authenticated
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-2 text-xs text-slate-600 bg-slate-50/50 my-1">
                      <span className="font-medium text-slate-700">Assigned Section:</span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.assignedClasses[0] || 'CS-101: Data Structures'}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                <UserIcon size={14} />
                <span>Faculty Login</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 text-[11px] font-medium py-1 px-2 rounded ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <Icon size={16} />
                {link.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                )}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
