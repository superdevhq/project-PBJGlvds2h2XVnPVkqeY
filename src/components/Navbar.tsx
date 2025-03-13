
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-900">
            AI Mermaid Diagram Generator
          </Link>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`${location.pathname === '/pricing' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pricing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
