import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gradient">ShopEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link to="/deals" className="text-secondary-700 hover:text-primary-600 transition-colors">
              Deals
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  rightIcon={<Search className="h-4 w-4" />}
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Nebula Button */}
            <a href={(import.meta as any).env.VITE_NEBULA_URL || "http://localhost:8080/"} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 p-1.5 sm:pl-2 sm:pr-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:block text-sm font-bold">Nebula AI</span>
            </a>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-secondary-700 hover:text-primary-600 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-secondary-700 hover:text-primary-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.firstName}</span>
                </button>
                {/* Dropdown menu would go here */}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-secondary-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4 px-2">
            <nav className="flex flex-col space-y-4">
              <a href={(import.meta as any).env.VITE_NEBULA_URL || "http://localhost:8080/"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 w-full p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-200 font-bold mb-2">
                <Sparkles className="h-5 w-5" />
                <span>Launch Nebula AI</span>
              </a>
              <Link
                to="/"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/deals"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </form>

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-secondary-200">
                  <Button variant="outline" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                    Login
                  </Button>
                  <Button onClick={() => { navigate('/register'); setIsMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
