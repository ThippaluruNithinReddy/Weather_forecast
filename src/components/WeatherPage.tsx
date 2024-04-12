import React, { useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import { WeatherContext, WeatherContextType } from '../contexts/WeatherContext';

import { FaCloud, FaTint, FaWind, FaThermometerHalf } from 'react-icons/fa';

const UNIT_METRIC = 'metric';
const UNIT_IMPERIAL = 'imperial';

interface WeatherPageProps {}

const moveClouds = keyframes`
    from {
        background-position: 0 0;
    }
    to {
        background-position: -1000px 0;
    }
`;

const BackgroundContainer = styled.div`
    padding: 20px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #3e5151, #decba4);
    background-image: url('../assets/cloud-background.gif'), linear-gradient(to bottom, #3e5151, #decba4);
    background-size: cover;
    animation: ${moveClouds} 60s linear infinite;
    color: white;
`;

const WeatherDetails = styled.div`
    background-color: rgba(180, 150, 200, 0.4);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(3, 2, 0, 0.8);
    width: 80%;
    text-align: center;
    font-weight: bold;
    color: black;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const ForecastContainer = styled.div`
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 20px;
`;

const ForecastBox = styled.div`
    background-color: rgba(120, 180, 200, 0.4);
    border-radius: 8px;
    padding: 15px;
    width: 180px;
    box-shadow: 0 4px 12px rgba(2, 2, 0, 0.5);
    color: black;
    font-weight: bold;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const WeatherPage: React.FC<WeatherPageProps> = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const { weatherData, forecastData, fetchWeatherData, unit, toggleUnit } = useContext(WeatherContext) as WeatherContextType;

    // Fetch weather data when the component mounts and when the city name changes
    useEffect(() => {
        // Ensure cityName is defined before calling fetchWeatherData
        if (cityName) {
            fetchWeatherData(cityName);
        }
    }, [cityName, fetchWeatherData]);
    
    return (
        <BackgroundContainer>
            <div>
                <h1>Weather in {cityName}</h1>

                {/* Button to toggle units */}
                <button onClick={toggleUnit} style={{ marginBottom: '10px' }}>
                    Switch to {unit === UNIT_METRIC ? UNIT_IMPERIAL : UNIT_METRIC} units
                </button>

                {/* Current Weather Details */}
                {weatherData ? (
                    <WeatherDetails>
                        <h2>Current Weather</h2>
                        <p>
                            <FaThermometerHalf style={{ color: '#FF5722', marginRight: '8px' }} />
                            Temperature: {weatherData.main.temp}°{unit === UNIT_METRIC ? 'C' : 'F'}
                        </p>
                        <p>
                            <FaCloud style={{ color: '#00BCD4', marginRight: '8px' }} />
                            Weather Description: {weatherData.weather[0].description}
                        </p>
                        <p>
                            <FaTint style={{ color: '#2196F3', marginRight: '8px' }} />
                            Humidity: {weatherData.main.humidity}%
                        </p>
                        <p>
                            <FaWind style={{ color: '#8BC34A', marginRight: '8px' }} />
                            Wind Speed: {weatherData.wind.speed} {unit === UNIT_METRIC ? 'm/s' : 'mph'}
                        </p>
                        <p style={{ color: 'white' }}>Atmospheric Pressure: {weatherData.main.pressure} hPa</p>
                    </WeatherDetails>
                ) : (
                    <p>Loading current weather...</p>
                )}

                {/* 5-Day Forecast Details */}
                {forecastData ? (
                    <ForecastContainer>
                        {forecastData.list.slice(0, 5).map((forecast) => (
                            <ForecastBox key={forecast.dt}>
                                <p>
                                    Date: {new Date(forecast.dt * 1000).toLocaleDateString()}
                                </p>
                                <p>
                                    <FaThermometerHalf style={{ color: '#FF5722', marginRight: '8px' }} />
                                    Temperature High: {forecast.main.temp_max}°{unit === UNIT_METRIC ? 'C' : 'F'}
                                </p>
                                <p>
                                    <FaThermometerHalf style={{ color: '#FF5722', marginRight: '8px' }} />
                                    Temperature Low: {forecast.main.temp_min}°{unit === UNIT_METRIC ? 'C' : 'F'}
                                </p>
                                <p>
                                    <FaCloud style={{ color: '#00BCD4', marginRight: '8px' }} />
                                    Weather Description: {forecast.weather[0].description}
                                </p>
                                <p>
                                    <FaTint style={{ color: '#2196F3', marginRight: '8px' }} />
                                    Precipitation Chance: {forecast.pop * 100}%
                                </p>
                            </ForecastBox>
                        ))}
                    </ForecastContainer>
                ) : (
                    <p>Loading forecast data...</p>
                )}
            </div>
        </BackgroundContainer>
    );
};

export default WeatherPage;
