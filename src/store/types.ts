
// Define the Redux store state types
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  important?: boolean;
  dueDate?: string;
  subTasks?: SubTask[];
  notes?: string;
  source?: string;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    description: string;
  }>;
}

export interface TaskState {
  tasks: Task[];
  activeFilter: string;
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  publicTasksLoading?: boolean;
  publicTasksError?: string | null;
}

export interface RootState {
  theme: ThemeState;
  auth: AuthState;
  tasks: TaskState;
}
