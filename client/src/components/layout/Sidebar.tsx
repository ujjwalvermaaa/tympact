import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ShoppingCart, CheckSquare, Wallet, Settings, Users, Bell, FileText, MessageSquare, Mic, HelpCircle } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  { path: '/browse', label: 'Browse', icon: Users },
  { path: '/missions', label: 'Missions', icon: CheckSquare },
  { path: '/time-wallet', label: 'Time Wallet', icon: Wallet },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/submit-task', label: 'Submit Task', icon: FileText },
  { path: '/feedback', label: 'Feedback', icon: MessageSquare },
  { path: '/voice-input', label: 'Voice Input', icon: Mic },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return null; // Don't render sidebar if user is not logged in
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-200">
        <div className="p-4">
            <nav className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg transition-colors duration-200 ` +
                            (isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-gray-700 hover:text-white')
                        }
                    >
                        <item.icon className="mr-4 h-5 w-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    </div>
  );
};

export default AppSidebar;
