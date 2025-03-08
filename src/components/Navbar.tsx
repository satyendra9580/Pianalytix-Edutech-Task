
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Menu, PlusCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { logout } from '../store/authSlice';
import { RootState } from '../store/types';

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <header className="w-full bg-background border-b border-border/40 sticky top-0 z-40 animate-fadeIn">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-secondary/80 transition-all duration-200 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-foreground" />
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PlusCircle size={20} className="text-primary-foreground" />
              </div>
              <span className="ml-2 text-xl font-semibold tracking-tight text-foreground">Do•It</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <div className="hidden md:flex items-center relative max-w-md w-full">
                <div className="absolute left-3 text-muted-foreground">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className="w-full bg-secondary/50 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <div className="hidden md:flex items-center">
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium hover:text-primary transition"
                  >
                    Logout
                  </button>
                </div>
                
                <button className="ml-2 relative">
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                </button>
              </div>
            </>
          )}
          
          {!isAuthenticated && (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
