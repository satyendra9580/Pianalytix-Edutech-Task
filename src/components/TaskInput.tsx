
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/taskSlice';
import { Bell, RotateCcw, Calendar, Star, CheckSquare, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarUI } from './ui/calendar';

const TaskInput: React.FC = () => {
  const dispatch = useDispatch();
  const [taskTitle, setTaskTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskTitle.trim() === '') return;
    
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      completed: false,
      priority: 'medium' as const, // default priority
      important: isImportant,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      notes: '',
      subTasks: []
    };
    
    dispatch(addTask(newTask));
    
    // Reset form
    setTaskTitle('');
    setIsImportant(false);
    setDueDate(undefined);
  };
  
  const handleDueDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setShowCalendar(false);
  };
  
  const toggleImportant = () => {
    setIsImportant(!isImportant);
  };
  
  return (
    <div className="mb-6 glass glass-dark rounded-lg p-4 animate-fadeIn">
      <h2 className="text-lg font-medium mb-4">Add A Task</h2>
      
      <form onSubmit={handleAddTask} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-background border-b-2 border-border focus:border-primary px-4 py-2 rounded-md focus:outline-none transition-all duration-200"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!taskTitle.trim()}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${taskTitle.trim() 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'}
            `}
          >
            ADD TASK
          </button>
        </div>
        
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            className={`p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200 ${isImportant ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/20' : ''}`}
            aria-label="Mark as important"
            onClick={toggleImportant}
          >
            <Star size={18} className={isImportant ? 'fill-amber-500' : 'text-muted-foreground'} />
          </button>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200 ${dueDate ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/20' : ''}`}
                aria-label="Set due date"
                onClick={() => setShowCalendar(true)}
              >
                <Calendar size={18} className={dueDate ? 'text-blue-500' : 'text-muted-foreground'} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <CalendarUI
                mode="single"
                selected={dueDate}
                onSelect={handleDueDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Add subtasks"
          >
            <CheckSquare size={18} className="text-muted-foreground" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Set reminder"
          >
            <Bell size={18} className="text-muted-foreground" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Set repeat"
          >
            <RotateCcw size={18} className="text-muted-foreground" />
          </button>
        </div>
        
        {dueDate && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar size={14} />
            <span>Due {format(dueDate, 'EEEE, MMMM d')}</span>
            <button 
              type="button" 
              className="text-red-500 hover:underline text-xs"
              onClick={() => setDueDate(undefined)}
            >
              Clear
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskInput;
