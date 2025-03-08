
import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  LayoutDashboard, 
  Star, 
  ListChecks, 
  Home,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/types';
import { setActiveFilter } from '../store/taskSlice';
import { fetchPublicTasks } from '../store/taskSlice';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, activeFilter, publicTasksLoading } = useSelector((state: RootState) => state.tasks);
  
  // Fetch public tasks when the component mounts
  useEffect(() => {
    if (tasks.length === 0 || !tasks.some(task => task.source === 'Public API')) {
      dispatch(fetchPublicTasks() as any);
    }
  }, [dispatch]);
  
  const sidebarItems = [
    { id: 'all', label: 'All Tasks', icon: <ListChecks size={18} /> },
    { id: 'today', label: 'Today', icon: <Calendar size={18} /> },
    { id: 'important', label: 'Important', icon: <Star size={18} /> },
    { id: 'planned', label: 'Planned', icon: <LayoutDashboard size={18} /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle size={18} /> },
  ];
  
  const completedTaskCount = tasks.filter(task => task.completed).length;
  const importantTaskCount = tasks.filter(task => task.important).length;
  const todayTaskCount = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length;
  
  const plannedTaskCount = tasks.filter(task => task.dueDate).length;
  const totalTaskCount = tasks.length;
  
  // Function to handle filter selection
  const handleFilterSelect = (filterId: string) => {
    dispatch(setActiveFilter(filterId));
  };
  
  // Function to load more public tasks
  const handleLoadMoreTasks = () => {
    dispatch(fetchPublicTasks() as any);
  };
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar pt-16
        transform transition-transform duration-300 ease-in-out
        border-r border-border/40 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:h-[calc(100vh-4rem)]
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex flex-col items-center justify-center p-4 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                <img 
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-foreground">
                {user?.name || 'Guest User'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
            
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 mb-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              onClick={() => {}}
            >
              <Plus size={16} />
              <span className="font-medium">Add list</span>
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${activeFilter === item.id ? 'sidebar-item-active' : ''}`}
                onClick={() => handleFilterSelect(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'completed' && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                    {completedTaskCount}
                  </span>
                )}
                {item.id === 'all' && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                    {totalTaskCount}
                  </span>
                )}
                {item.id === 'important' && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                    {importantTaskCount}
                  </span>
                )}
                {item.id === 'today' && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                    {todayTaskCount}
                  </span>
                )}
                {item.id === 'planned' && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                    {plannedTaskCount}
                  </span>
                )}
              </button>
            ))}
            
            <div className="pt-4 border-t border-border/40 mt-4">
              <h3 className="px-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Lists</h3>
              
              <button className="sidebar-item">
                <Home size={18} />
                <span>Home</span>
                <span className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs">
                  {totalTaskCount}
                </span>
              </button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-border/40">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Today Tasks</h4>
                <span className="text-sm font-bold">{completedTaskCount}/{totalTaskCount}</span>
              </div>
              
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ 
                    width: `${totalTaskCount > 0 ? (completedTaskCount / totalTaskCount) * 100 : 0}%`,
                    transition: 'width 0.5s ease-in-out' 
                  }}
                />
              </div>
              
              <button 
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
                onClick={handleLoadMoreTasks}
                disabled={publicTasksLoading}
              >
                <RefreshCw size={16} className={publicTasksLoading ? 'animate-spin' : ''} />
                <span className="font-medium">Load Public Tasks</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
