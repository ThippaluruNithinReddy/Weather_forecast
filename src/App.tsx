import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CityList from './components/CityList';
import WeatherPage from './components/WeatherPage';
import { WeatherProvider } from './contexts/WeatherContext';
import styled from 'styled-components';

const Nav = styled.nav`
    background-color: #333;
    padding: 10px;
`;

const NavLink = styled(Link)`
    color: white;
    margin-right: 20px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const App: React.FC = () => {
    return (
        <WeatherProvider>
            <Router>
                <Nav>
                    <NavLink to="/">Home</NavLink>
                </Nav>
                <Routes>
                    <Route path="/" element={<CityList />} />
                    <Route path="/weather/:cityName" element={<WeatherPage />} />
                </Routes>
            </Router>
        </WeatherProvider>
    );
};

export default App;
