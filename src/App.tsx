import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import store from './store/store';
import Index from "./pages/Index";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProctectedRoute";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/types";

const queryClient = new QueryClient();

// Theme Provider component
const ThemeProvider = ({ children }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  
  useEffect(() => {
    // Apply theme class to html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return children;
};

// Wrapped app with Redux Provider
const AppWithProviders = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
};

const App = () => <AppWithProviders />;

export default App;
