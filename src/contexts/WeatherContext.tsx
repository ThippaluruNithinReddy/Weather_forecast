
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface WeatherData {
    // Define the types of your weather data
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        description: string;
    }>;
    wind: {
        speed: number;
    };
    // Other fields as necessary...
}

interface ForecastData {
    // Define the types of your forecast data
    list: Array<{
        dt: number;
        main: {
            temp_min: number;
            temp_max: number;
        };
        weather: Array<{
            description: string;
        }>;
        pop: number;
    }>;
    // Other fields as necessary...
}

export interface WeatherContextType {
    weatherData: WeatherData | null;
    forecastData: ForecastData | null;
    fetchWeatherData: (city: string) => Promise<void>;
    favorites: string[];
    addFavorite: (city: string) => void;
    removeFavorite: (city: string) => void;
    unit: string;
    toggleUnit: () => void;
}

export const WeatherContext = createContext<WeatherContextType | null>(null);

// Define your WeatherProvider here as before...


interface WeatherProviderProps {
    children: ReactNode;
}

// You can replace this with an environment variable for security and flexibility.
const API_KEY = 'cbccc100a4d1b549a9538fb015f07417';

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [favorites, setFavorites] = useState<string[]>(() => {
        // Retrieve the list of favorite cities from local storage on initial load
        const storedFavorites = localStorage.getItem('favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });
    const [unit, setUnit] = useState<string>('metric');

    // Function to fetch weather data
    const fetchWeatherData = async (city: string): Promise<void> => {
        try {
            // Fetch current weather data
            const currentWeatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
            );
            setWeatherData(currentWeatherResponse.data as WeatherData);

            // Fetch forecast data
            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`
            );
            setForecastData(forecastResponse.data as ForecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Optional: Provide user feedback here, such as a toast or alert for error handling.
        }
    };

    // Function to toggle units
    const toggleUnit = (): void => {
        setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    };

    // Function to add a city to favorites
    const addFavorite = (city: string): void => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = [...prevFavorites, city];
            // Persist the updated favorites list to local storage
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    // Function to remove a city from favorites
    const removeFavorite = (city: string): void => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter((favCity) => favCity !== city);
            // Persist the updated favorites list to local storage
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    return (
        <WeatherContext.Provider
            value={{
                weatherData,
                forecastData,
                fetchWeatherData,
                favorites,
                addFavorite,
                removeFavorite,
                unit,
                toggleUnit,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};
