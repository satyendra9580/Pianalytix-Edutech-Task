
import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  deleteTask, 
  toggleTaskCompletion, 
  updateTaskPriority,
  toggleTaskImportance
} from '../store/taskSlice';
import { Trash2, Star, Calendar, ListChecks, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../store/types';

interface TaskItemProps {
  task: Task;
  onSelect?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onSelect }) => {
  const dispatch = useDispatch();
  
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTaskCompletion(task.id));
  };
  
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteTask(task.id));
  };
  
  const handleTogglePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    dispatch(updateTaskPriority({ id: task.id, priority: priorities[nextIndex] }));
  };
  
  const handleToggleImportance = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTaskImportance(task.id));
  };
  
  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return <Star className="text-red-500 fill-red-500" />;
      case 'medium':
        return <Star className="text-amber-500 fill-amber-500" />;
      case 'low':
        return <Star className="text-blue-500" />;
      default:
        return <Star className="text-blue-500" />;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return null;
    }
  };
  
  return (
    <div 
      className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors group flex items-center gap-3 ${task.completed ? 'task-completed' : ''} ${task.important ? 'border-l-4 border-l-amber-500' : ''}`}
      onClick={() => onSelect && onSelect(task)}
    >
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => {}}
          className="sr-only"
          id={`task-${task.id}`}
        />
        <label 
          htmlFor={`task-${task.id}`}
          className={`
            w-5 h-5 rounded border border-muted flex items-center justify-center cursor-pointer
            ${task.completed ? 'bg-success border-success' : 'hover:border-primary'}
          `}
          onClick={handleCheckboxChange}
        >
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </label>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </span>
          
          {task.priority !== 'medium' && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              task.priority === 'high' 
                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            }`}>
              {task.priority}
            </span>
          )}
          
          {task.source && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              {task.source}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.subTasks && task.subTasks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks size={12} />
              <span>{task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}</span>
            </div>
          )}
          
          {task.notes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare size={12} />
              <span>Note</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleTogglePriority}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Change priority"
        >
          {getPriorityIcon()}
        </button>
        
        <button 
          onClick={handleToggleImportance}
          className={`p-2 rounded-full hover:bg-muted transition-colors ${task.important ? 'text-amber-500' : 'text-muted-foreground'}`}
          aria-label="Mark as important"
        >
          <Star size={16} className={task.important ? 'fill-amber-500' : ''} />
        </button>
        
        <button 
          onClick={handleDeleteTask}
          className="p-2 rounded-full hover:bg-muted text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
