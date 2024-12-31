"use client";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("./components/Map").then((mod) => mod.Map), {
  ssr: false
});

interface MarkerData {
  latitude: number;
  longitude: number;
  description: string;
}

type MapLocation = {
  id: string;
  lat: number;
  lng: number;
  description: string;
};

export default function Home() {
  const [locations, setLocations] = useState<MapLocation[]>([]);


  useEffect(() => {
    const fetchedLocations: MarkerData[] = [
      { latitude: 14.25727, longitude: 100.5074, description: "Test Location 1" },
      { latitude: 14.25827, longitude: 100.5084, description: "Test Location 2" },
    ];

    const mappedLocations = fetchedLocations.map((location, index) => ({
      id: `location-${index}`,
      lat: location.latitude,
      lng: location.longitude,
      description: location.description,
    }));

    setLocations(mappedLocations);
  }, []);

  return (


    <Map center={{ lat: 14.25727, lng: 100.5074 }} locations={locations} />


  );
}
