import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { Icon, LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useState } from 'react';


type MapType = "roadmap" | "satellite" | "hybrid" | "terrain"

type MapLocation = LatLngLiteral & { id: string };

type MapProps = {
    center: LatLngLiteral;
    locations: MapLocation[];
};

const SelectedLocation: React.FC<{ center: LatLngLiteral }> = ({ center }) => {
    const map = useMap();
    map.panTo(center, { animate: true });
    return null;
};

export const Map: React.FC<MapProps> = ({ center, locations }) => {
    const [mapType, setMapType] = useState<MapType>("terrain")
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

    const getUrl = () => {
        const mapTypeUrls: Record<MapType, string> = {
            roadmap: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
            satellite: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
            hybrid: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
            terrain: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
        }
        return mapTypeUrls[mapType]
    }

    const defaultIcon = new Icon({ iconUrl: '../Images/Marker/default-icon.png', iconSize: [47, 55] });
    const activeIcon = new Icon({ iconUrl: '../Images/Marker/active-icon.png', iconSize: [57, 55] });

    const renderMarkers = () => {
        return locations.map((location) => (
            <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                icon={location.id === selectedLocation?.id ? activeIcon : defaultIcon}
                eventHandlers={{
                    click: () => setSelectedLocation(location),
                }}
            />
        ));
    };

    return (
        <div className="w-full h-full  rounded-[5px] overflow-hidden">
            <MapContainer
                center={center}
                zoom={6}
                minZoom={4}
                zoomControl={false}
                attributionControl={false}
                className="w-full h-full"
            >
                <TileLayer url={getUrl()} />
                {selectedLocation && <SelectedLocation center={selectedLocation} />}
                {renderMarkers()}
                <ZoomControl position="topright" />
            </MapContainer>
        </div>
    );
};
