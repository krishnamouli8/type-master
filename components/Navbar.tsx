import React from 'react';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 fixed top-0 left-0 z-50 transition-colors duration-300 bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <div className="text-2xl font-bold transition-colors duration-300 text-amber-300">
          TypeMaster
        </div>
        
        <div className="flex items-center gap-4">          
          <div className="p-2 rounded-xl cursor-pointer transition-all duration-300 bg-gray-800 text-amber-300 hover:bg-gray-700">
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;