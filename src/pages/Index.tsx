
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import WeatherWidget from '../components/WeatherWidget';
import { RootState } from '../store/types';
import { AppDispatch } from '../store/store';
import { fetchPublicTasks } from '../store/taskSlice';

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme.mode);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // If we don't have any tasks, fetch some public ones as examples
    if (tasks.length === 0) {
      dispatch(fetchPublicTasks());
    }
  }, [dispatch, tasks.length]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Removed the condition that was preventing rendering when not authenticated
  // if (!isAuthenticated) return null;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-auto pb-20 pt-4 px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <WeatherWidget />
            <TaskInput />
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
