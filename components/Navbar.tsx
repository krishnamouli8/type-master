import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { NavbarProps } from './types';

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className={`w-full h-16 fixed top-0 left-0 z-50 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm' 
        : 'bg-white/95 border-b border-emerald-100 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <div className={`text-2xl font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          TypeMaster
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className={`p-2 rounded-xl cursor-pointer transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 text-emerald-400 hover:bg-gray-700'
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
          }`}>
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;