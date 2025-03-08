
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cloud, CloudRain, Sun, CloudLightning, CloudSnow, Wind } from 'lucide-react';
import { fetchWeatherData } from '../store/taskSlice';
import { RootState } from '../store/types';
import { AppDispatch } from '../store/store';

const WeatherWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { weatherData, weatherLoading, weatherError } = useSelector((state: RootState) => state.tasks);
  const [location, setLocation] = useState('London');
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Convert coordinates to city name using reverse geocoding
          // For simplicity, we'll just use a default city
          dispatch(fetchWeatherData(location));
        },
        (error) => {
          console.error("Error getting location:", error);
          dispatch(fetchWeatherData(location));
        }
      );
    } else {
      dispatch(fetchWeatherData(location));
    }
  }, [dispatch, location]);
  
  const getWeatherIcon = (weatherCode) => {
    // Weather condition codes from OpenWeatherMap API
    if (!weatherCode) return <Cloud />;
    
    // Thunderstorm
    if (weatherCode >= 200 && weatherCode < 300) {
      return <CloudLightning />;
    }
    // Drizzle or Rain
    if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
      return <CloudRain />;
    }
    // Snow
    if (weatherCode >= 600 && weatherCode < 700) {
      return <CloudSnow />;
    }
    // Atmosphere (mist, fog, etc)
    if (weatherCode >= 700 && weatherCode < 800) {
      return <Wind />;
    }
    // Clear
    if (weatherCode === 800) {
      return <Sun />;
    }
    // Cloudy
    return <Cloud />;
  };
  
  if (weatherLoading) {
    return (
      <div className="p-4 glass rounded-lg w-full animate-pulse">
        <div className="h-8 bg-muted/50 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-muted/50 rounded w-2/3"></div>
      </div>
    );
  }
  
  if (weatherError) {
    return (
      <div className="p-4 glass rounded-lg w-full">
        <p className="text-sm text-muted-foreground">
          Unable to load weather data. Please try again later.
        </p>
      </div>
    );
  }
  
  return (
    <div className="glass glass-dark rounded-lg p-4 mb-4 transition-all duration-300 hover:shadow-md">
      {weatherData ? (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">
              {weatherData.name}, {weatherData.sys.country}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-semibold">
                {Math.round(weatherData.main.temp)}°C
              </span>
              <span className="text-sm text-muted-foreground">
                {weatherData.weather[0].description}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              <span>H: {Math.round(weatherData.main.temp_max)}°</span>
              <span>L: {Math.round(weatherData.main.temp_min)}°</span>
              <span>Humidity: {weatherData.main.humidity}%</span>
            </div>
          </div>
          <div className="text-3xl">
            {getWeatherIcon(weatherData.weather[0].id)}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
