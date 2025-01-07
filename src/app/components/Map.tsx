import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import { Icon, LatLngLiteral } from 'leaflet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

type MapLocation = {
    id: string;
    lat: number;
    lng: number;
    shouldZoom?: boolean;
};

type MapProps = {
    center: { lat: number; lng: number };
    locations: MapLocation[];
    mapId: string;
};

type MarkerData = {
    _id?: string;
    latitude: number;
    longitude: number;
    description?: string;
    status: 'pending' | 'rescued';
};

type SelectedLocationProps = {
    center: LatLngLiteral;
    shouldZoom?: boolean;
};

const SelectedLocation: React.FC<SelectedLocationProps> = ({ center, shouldZoom = true }) => {
    const map = useMap();

    useEffect(() => {
        if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
            map.setView(center, shouldZoom ? 15 : map.getZoom(), { animate: true });
        }
    }, [center, map, shouldZoom]);

    return null;
};

const ClickHandler = ({ onClick, isEnabled }: { onClick: (latlng: LatLngLiteral) => void, isEnabled: boolean }) => {
    useMapEvents({
        click: (e) => {
            if (isEnabled) {
                onClick(e.latlng);
            }
        },
    });
    return null;
};

const CoordinatesSearch: React.FC<{
    onSearch: (lat: number, lng: number, shouldZoom: boolean) => void
}> = ({ onSearch }) => {
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
            onSearch(parseFloat(lat), parseFloat(lng), true);
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

export const Map: React.FC<MapProps> = ({ center, locations, mapId }) => {
    const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
    const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [isAddingEnabled, setIsAddingEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCoordinateSearch = (lat: number, lng: number, shouldZoom: boolean) => {
        setSelectedLocation({ id: 'search', lat, lng, shouldZoom });
    };

    const getUrl = () => {
        const mapTypeUrls: Record<'roadmap' | 'satellite' | 'hybrid' | 'terrain', string> = {
            roadmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            hybrid: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png',
            terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        };
        return mapTypeUrls[mapType];
    };

    const defaultIcon = new Icon({
        iconUrl: '../Images/Marker/default-icon.png',
        iconSize: [47, 55],
        iconAnchor: [23, 55]
    });

    const activeIcon = new Icon({
        iconUrl: '../Images/Marker/active-icon.png',
        iconSize: [57, 55],
        iconAnchor: [28, 55]
    });

    useEffect(() => {
        if (Array.isArray(locations)) {
            setMapLocations(locations.filter(loc =>
                loc &&
                typeof loc.lat === 'number' &&
                typeof loc.lng === 'number' &&
                !isNaN(loc.lat) &&
                !isNaN(loc.lng)
            ));
        }
    }, [locations]);

    const addMarker = async (latlng: LatLngLiteral) => {
        if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') {
            toast.error('Invalid location coordinates');
            return;
        }

        setIsLoading(true);

        const newMarker: MarkerData = {
            latitude: latlng.lat,
            longitude: latlng.lng,
            status: 'pending',
            description: ''
        };

        try {
            const response = await fetch(`/api/maps/${mapId}/markers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMarker),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add marker');
            }

            const updatedMap = await response.json();
            const updatedLocations = updatedMap.markers
                .filter((marker: MarkerData) => marker && marker.latitude && marker.longitude)
                .map((marker: MarkerData) => ({
                    id: marker._id,
                    lat: marker.latitude,
                    lng: marker.longitude,
                }));

            setMapLocations(updatedLocations);
            toast.success('Marker added successfully');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to add marker');
            console.error('Error adding marker:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const validCenter = center && typeof center.lat === 'number' && typeof center.lng === 'number'
        ? center
        : { lat: 13.7563, lng: 100.5018 };

    return (
        <div className="w-full h-full rounded-[5px] overflow-hidden relative">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <CoordinatesSearch onSearch={handleCoordinateSearch} />
            <div className="absolute bottom-2 right-2 z-[1000] bg-white p-2 rounded-lg shadow-md space-y-2">
                <div className="flex justify-center mb-2">
                    <button
                        onClick={() => setIsAddingEnabled(!isAddingEnabled)}
                        disabled={isLoading}
                        className={`w-full px-3 py-1 rounded-md ${isAddingEnabled
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Adding Marker...' : isAddingEnabled ? 'Adding Enabled' : 'Adding Disabled'}
                    </button>
                </div>

                <div className="flex space-x-2">
                    {['roadmap', 'satellite', 'hybrid', 'terrain'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setMapType(type as 'roadmap' | 'satellite' | 'hybrid' | 'terrain')}
                            className={`px-3 py-1 rounded-md ${mapType === type
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-black hover:bg-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <MapContainer
                center={validCenter}
                zoom={6}
                minZoom={4}
                zoomControl={false}
                attributionControl={false}
                className="w-full h-full"
            >
                <TileLayer url={getUrl()} />
                <ClickHandler onClick={addMarker} isEnabled={isAddingEnabled} />
                {selectedLocation && <SelectedLocation center={selectedLocation} shouldZoom={selectedLocation.shouldZoom} />}
                {mapLocations.map((location) => {
                    const markerId = typeof location.id === 'string' ? location.id : String(location.id);
                    return (
                        <Marker
                            key={markerId}
                            position={{ lat: location.lat, lng: location.lng }}
                            icon={markerId === selectedLocation?.id ? activeIcon : defaultIcon}
                            eventHandlers={{
                                click: () => setSelectedLocation(location),
                            }}
                        />
                    );
                })}
                <ZoomControl position="topleft" />
            </MapContainer>
        </div>
    );
};

export default Map;