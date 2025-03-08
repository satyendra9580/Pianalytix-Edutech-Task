
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from './TaskItem';
import { CheckCheck, Clock, Star, List, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, Task } from '../store/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { format } from 'date-fns';
import { toggleTaskCompletion, toggleTaskImportance, updateTaskPriority, deleteTask, updateTask, setActiveFilter } from '../store/taskSlice';

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, activeFilter } = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskNote, setTaskNote] = useState('');
  
  // When selected task changes, update the note
  useEffect(() => {
    if (selectedTask) {
      setTaskNote(selectedTask.notes || '');
    }
  }, [selectedTask]);
  
  const getFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeFilter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'important':
        return tasks.filter(task => task.important);
      case 'today':
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case 'planned':
        return tasks.filter(task => task.dueDate);
      case 'all':
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleCloseDialog = () => {
    setSelectedTask(null);
  };
  
  const handleSaveNote = () => {
    if (selectedTask) {
      dispatch(updateTask({
        id: selectedTask.id,
        notes: taskNote
      }));
    }
  };
  
  const handleToggleTaskCompletion = () => {
    if (selectedTask) {
      dispatch(toggleTaskCompletion(selectedTask.id));
    }
  };
  
  const handleToggleImportance = () => {
    if (selectedTask) {
      dispatch(toggleTaskImportance(selectedTask.id));
    }
  };
  
  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(deleteTask(selectedTask.id));
      setSelectedTask(null);
    }
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filter buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">My Tasks</h2>
        
        <div className="flex items-center p-1 bg-secondary/50 rounded-lg">
          <button
            onClick={() => dispatch(setActiveFilter('all'))}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              activeFilter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <List size={16} />
              <span className="hidden sm:inline">All</span>
            </span>
          </button>
          
          <button
            onClick={() => dispatch(setActiveFilter('today'))}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              activeFilter === 'today' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              <span className="hidden sm:inline">Today</span>
              {filteredTasks.filter(t => {
                if (!t.dueDate) return false;
                const today = new Date();
                const dueDate = new Date(t.dueDate);
                return dueDate.toDateString() === today.toDateString();
              }).length > 0 && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                  {filteredTasks.filter(t => {
                    if (!t.dueDate) return false;
                    const today = new Date();
                    const dueDate = new Date(t.dueDate);
                    return dueDate.toDateString() === today.toDateString();
                  }).length}
                </span>
              )}
            </span>
          </button>
          
          <button
            onClick={() => dispatch(setActiveFilter('important'))}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              activeFilter === 'important' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Star size={16} />
              <span className="hidden sm:inline">Important</span>
              {filteredTasks.filter(t => t.important).length > 0 && (
                <span className="bg-amber-500/10 text-amber-500 text-xs px-1.5 py-0.5 rounded-full">
                  {filteredTasks.filter(t => t.important).length}
                </span>
              )}
            </span>
          </button>
          
          <button
            onClick={() => dispatch(setActiveFilter('completed'))}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              activeFilter === 'completed' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <CheckCheck size={16} />
              <span className="hidden sm:inline">Completed</span>
              {completedTasks.length > 0 && (
                <span className="bg-success/10 text-success text-xs px-1.5 py-0.5 rounded-full">
                  {completedTasks.length}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
      
      <div className="glass glass-dark rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <List size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeFilter === 'active' 
                  ? "You've completed all your tasks!" 
                  : activeFilter === 'completed'
                    ? "You haven't completed any tasks yet."
                    : activeFilter === 'important'
                      ? "You don't have any important tasks."
                      : activeFilter === 'today'
                        ? "You don't have any tasks due today."
                        : "Start by adding a new task above."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="divide-y divide-border/50">
                {incompleteTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem task={task} onSelect={handleTaskSelect} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {activeFilter !== 'completed' && completedTasks.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Completed</h3>
            <span className="text-sm text-muted-foreground">
              {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          
          <div className="glass glass-dark rounded-lg overflow-hidden">
            <div className="divide-y divide-border/50">
              {completedTasks.slice(0, 4).map((task) => (
                <TaskItem key={task.id} task={task} onSelect={handleTaskSelect} />
              ))}
              
              {completedTasks.length > 4 && (
                <div className="p-4 text-center">
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => dispatch(setActiveFilter('completed'))}
                  >
                    Show {completedTasks.length - 4} more completed tasks
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Task detail dialog */}
      <Dialog open={!!selectedTask} onOpenChange={open => !open && handleCloseDialog()}>
        {selectedTask && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-start gap-3">
                <div className="checkbox-container mt-1">
                  <input
                    type="checkbox"
                    checked={selectedTask.completed}
                    onChange={handleToggleTaskCompletion}
                    className="sr-only"
                    id="detail-checkbox"
                  />
                  <label 
                    htmlFor="detail-checkbox"
                    className={`
                      w-5 h-5 rounded border border-muted flex items-center justify-center cursor-pointer
                      ${selectedTask.completed ? 'bg-success border-success' : 'hover:border-primary'}
                    `}
                  >
                    {selectedTask.completed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg ${selectedTask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {selectedTask.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTask.priority !== 'medium' && (
                      <span className={`priority-badge priority-${selectedTask.priority}`}>
                        {selectedTask.priority}
                      </span>
                    )}
                    
                    {selectedTask.source && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {selectedTask.source}
                      </span>
                    )}
                    
                    {selectedTask.dueDate && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(selectedTask.dueDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={handleToggleImportance}
                  className={`p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200 ${selectedTask.important ? 'text-amber-500' : ''}`}
                >
                  <Star size={18} className={selectedTask.important ? 'fill-amber-500' : ''} />
                </button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <label htmlFor="task-notes" className="text-sm font-medium mb-2 block">
                Notes
              </label>
              <textarea
                id="task-notes"
                rows={5}
                className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add notes about this task..."
                value={taskNote}
                onChange={(e) => setTaskNote(e.target.value)}
                onBlur={handleSaveNote}
              />
            </div>
            
            <DialogFooter className="flex items-center justify-between mt-4">
              <button 
                className="text-destructive hover:text-destructive/80 transition-colors duration-200 flex items-center gap-1"
                onClick={handleDeleteTask}
              >
                Delete
              </button>
              
              <button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors duration-200"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default TaskList;
