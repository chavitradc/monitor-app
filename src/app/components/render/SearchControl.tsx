import { useState } from "react";
import { toast } from 'react-toastify';

const CoordinatesSearch: React.FC<{ onSearch: (lat: number, lng: number) => void }> = ({ onSearch }) => {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const validateCoordinates = (): boolean => {
        if (!lat || !lng) {
            toast.error('Please enter both latitude and longitude');
            return false;
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            toast.error('Invalid coordinate format');
            return false;
        }

        if (latitude < -90 || latitude > 90) {
            toast.error('Latitude must be between -90 and 90');
            return false;
        }

        if (longitude < -180 || longitude > 180) {
            toast.error('Longitude must be between -180 and 180');
            return false;
        }

        return true;
    };

    const handleSearch = () => {
        if (validateCoordinates()) {
            onSearch(parseFloat(lat), parseFloat(lng));
            toast.success('Location found!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Latitude (-90 to 90)"
                className="px-3 py-2 border rounded-md bg-zinc-50 border-gray-300"
            />
            <input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Longitude (-180 to 180)"
                className="px-3 py-2 border rounded-md bg-zinc-50 border-gray-300"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Search
            </button>
        </div>
    );
};

export default CoordinatesSearch;