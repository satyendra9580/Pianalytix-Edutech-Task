import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get stored tasks from localStorage
const getStoredTasks = () => {
  if (typeof window !== 'undefined') {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
  return [];
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = createAsyncThunk(
  'tasks/fetchWeather',
  async (location, { rejectWithValue }) => {
    try {
      // Using OpenWeatherMap API with a mock API key
      // In a real app, this would be an environment variable
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bd5e378503939ddaee76f12ad7a97608`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
);

// Fetch public tasks from JSONPlaceholder API
export const fetchPublicTasks = createAsyncThunk(
  'tasks/fetchPublicTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
      return response.data.map(task => ({
        id: `public-${task.id}`,
        title: task.title,
        completed: task.completed,
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        important: Math.random() > 0.7,
        source: 'JSONPlaceholder',
        dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 604800000).toISOString() : null
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public tasks');
    }
  }
);

// Generate some sample tasks if none exist
const generateSampleTasks = () => {
  const storedTasks = getStoredTasks();
  if (storedTasks.length > 0) {
    return storedTasks;
  }
  
  // Sample tasks to get started
  const sampleTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      completed: false,
      priority: 'high',
      important: true,
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      notes: 'Include budget estimates and timeline'
    },
    {
      id: '2',
      title: 'Buy groceries',
      completed: false,
      priority: 'medium',
      important: false,
      dueDate: new Date(Date.now() + 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      completed: true,
      priority: 'low',
      important: false
    },
    {
      id: '4',
      title: 'Review monthly budget',
      completed: false,
      priority: 'high',
      important: true,
      dueDate: new Date().toISOString()
    }
  ];
  
  // Save sample tasks to localStorage
  localStorage.setItem('tasks', JSON.stringify(sampleTasks));
  return sampleTasks;
};

const initialState = {
  tasks: generateSampleTasks(),
  weatherData: null,
  weatherLoading: false,
  weatherError: null,
  activeFilter: 'all', // 'all', 'completed', 'active',
  publicTasksLoading: false,
  publicTasksError: null
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskPriority: (state, action) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    updateTask: (state, action) => {
      const { id, ...updatedFields } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedFields };
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskImportance: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.important = !task.important;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.weatherLoading = false;
        state.weatherError = action.payload;
      })
      .addCase(fetchPublicTasks.pending, (state) => {
        state.publicTasksLoading = true;
        state.publicTasksError = null;
      })
      .addCase(fetchPublicTasks.fulfilled, (state, action) => {
        state.publicTasksLoading = false;
        state.tasks = [...state.tasks, ...action.payload];
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      })
      .addCase(fetchPublicTasks.rejected, (state, action) => {
        state.publicTasksLoading = false;
        state.publicTasksError = action.payload;
      });
  }
});

export const { 
  addTask, 
  deleteTask, 
  toggleTaskCompletion, 
  updateTaskPriority,
  setActiveFilter,
  updateTask,
  toggleTaskImportance
} = taskSlice.actions;

export default taskSlice.reducer;
