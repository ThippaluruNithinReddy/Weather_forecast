import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { WeatherContext, WeatherContextType } from '../contexts/WeatherContext';

import axios from 'axios';

interface City {
    id: number;
    name: string;
    country: string;
    timezone: string;
    population: number;
    latitude: number;
    longitude: number;
}

const Container = styled.div`
    padding: 20px;
`;

const SearchInput = styled.input`
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
`;

const Td = styled.td`
    padding: 10px;
    border: 1px solid #ccc;
`;

const LoadMoreButton = styled.button`
    margin-top: 20px;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const CityList: React.FC = () => {
    const { fetchWeatherData, favorites, addFavorite, removeFavorite } = useContext(WeatherContext) as WeatherContextType;
    const [cities, setCities] = useState<City[]>([]);
    const [filteredCities, setFilteredCities] = useState<City[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Fetch city data from the API with pagination
    const fetchCities = async (page: number): Promise<void> => {
        try {
            const startIndex = page * 20;
            const response = await axios.get(
                `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=20&start=${startIndex}`
            );

            // Extract city data
            const newCities = response.data.records.map((record: any) => ({
                id: record.fields.geoname_id,
                name: record.fields.name,
                country: record.fields.cou_name_en,
                timezone: record.fields.timezone,
                population: record.fields.population,
                latitude: record.fields.coordinates[0],
                longitude: record.fields.coordinates[1],
            })) as City[];

            // Update the city data and filtered cities states
            setCities((prevCities) => [...prevCities, ...newCities]);
            setFilteredCities((prevCities) => [...prevCities, ...newCities]);

            // Check if there are more cities to load
            setHasMore(newCities.length > 0);
        } catch (error) {
            console.error('Error fetching city data:', error);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchCities(page);
    }, [page]);

    // Handle loading more data
    const loadMore = (): void => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Handle search input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        // Filter cities based on search term
        setFilteredCities(
            cities.filter((city) => city.name.toLowerCase().includes(searchTerm))
        );
    };

    // Handle sorting cities
    const handleSort = (column: keyof City): void => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortColumn(column);
        setSortDirection(isAsc ? 'desc' : 'asc');

        // Sort cities based on the specified column and direction
        const sortedCities = [...filteredCities].sort((a, b) => {
            const comparison = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        setFilteredCities(sortedCities);
    };

    return (
        <Container>
            {/* Search input */}
            <SearchInput
                type="text"
                placeholder="Search by city name..."
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Table */}
            <Table>
                <thead>
                    <tr>
                        <Th onClick={() => handleSort('id')}>ID</Th>
                        <Th onClick={() => handleSort('name')}>Name</Th>
                        <Th onClick={() => handleSort('country')}>Country</Th>
                        <Th onClick={() => handleSort('timezone')}>Timezone</Th>
                        <Th onClick={() => handleSort('population')}>Population</Th>
                        <Th onClick={() => handleSort('latitude')}>Latitude</Th>
                        <Th onClick={() => handleSort('longitude')}>Longitude</Th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCities.map((city) => (
                        <tr key={city.id}>
                            <Td>{city.id}</Td>
                            <Td>
                                <Link to={`/weather/${city.name}`} onClick={() => fetchWeatherData(city.name)}>
                                    {city.name}
                                </Link>
                            </Td>
                            <Td>{city.country}</Td>
                            <Td>{city.timezone}</Td>
                            <Td>{city.population}</Td>
                            <Td>{city.latitude}</Td>
                            <Td>{city.longitude}</Td>
                            <Td>
                                {favorites.includes(city.name) ? (
                                    <button onClick={() => removeFavorite(city.name)}>Remove from Favorites</button>
                                ) : (
                                    <button onClick={() => addFavorite(city.name)}>Add to Favorites</button>
                                )}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Load more button */}
            {hasMore && <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>}
        </Container>
    );
};

export default CityList;
