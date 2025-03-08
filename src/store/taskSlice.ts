
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task, WeatherData, TaskState } from './types';

// Get stored tasks from localStorage
const getStoredTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
  return [];
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = createAsyncThunk(
  'tasks/fetchWeather',
  async (location: string, { rejectWithValue }) => {
    try {
      // Using OpenWeatherMap API with a mock API key
      // In a real app, this would be an environment variable
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bd5e378503939ddaee76f12ad7a97608`
      );
      return response.data as WeatherData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
);

// Fetch tasks from a public API - JSONPlaceholder
export const fetchPublicTasks = createAsyncThunk(
  'tasks/fetchPublicTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
      
      // Transform the API data to match our Task interface
      const formattedTasks: Task[] = response.data.map((task: any) => ({
        id: `public-${task.id}`,
        title: task.title,
        completed: task.completed,
        priority: 'medium', // Default priority
        source: 'Public API', // To indicate these are from JSONPlaceholder
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 604800000)).toISOString() // Random due date within a week
      }));
      
      return formattedTasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public tasks');
    }
  }
);

const initialState: TaskState = {
  tasks: getStoredTasks(),
  weatherData: null,
  weatherLoading: false,
  weatherError: null,
  activeFilter: 'all', // 'all', 'completed', 'active', 'important'
  publicTasksLoading: false,
  publicTasksError: null
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskImportance: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.important = !task.important;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{id: string, priority: 'low' | 'medium' | 'high'}>) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & {id: string}>) => {
      const { id, ...updatedFields } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedFields };
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    addSubTask: (state, action: PayloadAction<{taskId: string, subTask: {id: string, title: string, completed: boolean}}>) => {
      const { taskId, subTask } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        if (!task.subTasks) {
          task.subTasks = [];
        }
        task.subTasks.push(subTask);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleSubTaskCompletion: (state, action: PayloadAction<{taskId: string, subTaskId: string}>) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.subTasks) {
        const subTask = task.subTasks.find(st => st.id === subTaskId);
        if (subTask) {
          subTask.completed = !subTask.completed;
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
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
        state.weatherError = action.payload as string;
      })
      .addCase(fetchPublicTasks.pending, (state) => {
        state.publicTasksLoading = true;
        state.publicTasksError = null;
      })
      .addCase(fetchPublicTasks.fulfilled, (state, action) => {
        state.publicTasksLoading = false;
        // Append public tasks to existing tasks
        state.tasks = [...state.tasks, ...action.payload];
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      })
      .addCase(fetchPublicTasks.rejected, (state, action) => {
        state.publicTasksLoading = false;
        state.publicTasksError = action.payload as string;
      });
  }
});

export const { 
  addTask, 
  deleteTask, 
  toggleTaskCompletion,
  toggleTaskImportance,
  updateTaskPriority,
  setActiveFilter,
  updateTask,
  addSubTask,
  toggleSubTaskCompletion
} = taskSlice.actions;

export default taskSlice.reducer;
