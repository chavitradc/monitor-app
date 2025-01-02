"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";



// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/app/components/Map").then((mod) => mod.Map), {
    ssr: false,
});

interface MarkerData {
    _id: string;
    latitude: number;
    longitude: number;
    description?: string;
    status: "pending" | "rescued";
}

interface MapData {
    _id: string;
    name: string;
    markers: MarkerData[];
}

export default function MapDisplay({ params }: { params: Promise<{ mapId: string }> }) {
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapId, setMapId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // สำหรับจัดการข้อผิดพลาด

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setMapId(resolvedParams.mapId);
        };

        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!mapId) return;

        const fetchMapData = async () => {
            try {
                const response = await fetch(`/api/maps/${mapId}`);
                if (!response.ok) {

                    setError("Map not found");

                    return;
                }
                const data = await response.json();
                if (data.error) {
                    setError(data.error); // ใช้ข้อผิดพลาดจาก API
                } else {
                    setMapData(data);
                }
            } catch (error) {
                console.error("Failed to fetch map:", error);
                setError("Failed to load the map. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMapData();
    }, [mapId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!mapData) return <div>Map Not Found</div>;

    const center = mapData.markers.length > 0
        ? { lat: mapData.markers[0].latitude, lng: mapData.markers[0].longitude }
        : { lat: 13.7563, lng: 100.5018 }; // Default center (Bangkok)

    const locations = mapData.markers.map((marker) => ({
        id: marker._id,
        lat: marker.latitude,
        lng: marker.longitude,
    }));

    return <Map center={center} locations={locations} mapId={mapData._id} />;
}
