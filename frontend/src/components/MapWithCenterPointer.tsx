import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { LuSearch, LuX } from 'react-icons/lu';

import { useLocation } from '../contexts/LocationContext'

const MAP_API_KEY = 'ecad8017a2fa45cd81a9294fa8cb93ff';

type Coords = {
    lat: number;
    lng: number;
};


type LocationFeature = {
    properties: {
        formatted: string;
        city?: string;
        state?: string;
        country?: string;
        street?: string;
    };
    geometry: {
        coordinates: [number, number];
    };
};

const LocationUpdater: React.FC<{ setCenterCoords: (coords: Coords) => void }> = ({ setCenterCoords }) => {
    useMapEvents({
        moveend: (e) => {
            const center = e.target.getCenter();
            setCenterCoords({ lat: center.lat, lng: center.lng });
        },
    });
    return null;
};

const ResizeMapOnModalOpen: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);
    return null;
};


const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom(), { animate: true });
        }
    }, [lat, lng, map]);
    return null;
};


const MapWithCenterPointer: React.FC = () => {
    const [centerCoords, setCenterCoords] = useState<Coords>({ lat: 19.03455235, lng: 72.84997115 });
    const mapRef = useRef<L.Map | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<LocationFeature[]>([]);

    const { selectedAddress, setSelectedAddress, setAddress, address } = useLocation();

    const [input, setInput] = useState<string>('')

    const handleMapReady = () => {
        const mapInstance = mapRef.current;
        if (mapInstance) {
            console.log('Map is ready:', mapInstance);
        }
    };


    useEffect(() => {
        const storedCoords = localStorage.getItem('selectedLocationCoordinates');
        if (storedCoords) {
            const [lng, lat] = storedCoords.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                setCenterCoords({ lat, lng });
            }
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current!.invalidateSize();
            }, 300);
        }
    }, []);

    useEffect(() => {
        if (selectedAddress) {
            setCenterCoords({
                lat: selectedAddress.geometry.coordinates[1],
                lng: selectedAddress.geometry.coordinates[0],
            })
            setInput(selectedAddress.properties.formatted)
            setResults([])
        }
    }, [selectedAddress])

    useEffect(() => {
        if (!centerCoords.lat || !centerCoords.lng) return;
        const fetchAddress = async () => {
            try {
                const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse`, {
                    params: {
                        lat: centerCoords.lat,
                        lon: centerCoords.lng,
                        apiKey: MAP_API_KEY,
                    },
                });

                const features = res.data?.features;
                if (features?.length) {
                    setAddress(features[0].properties.formatted);
                } else {
                    setAddress('Address not found for this location');
                }
            } catch (error) {
                setAddress('Error fetching address: ');
                console.log('Error fetching address: ', error);
            }
        };

        fetchAddress();
    }, [centerCoords]);


    useEffect(() => {
        const debounceDelay = setTimeout(async () => {

            if (searchTerm.length < 2) return;

            try {
                const response = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
                    params: {
                        text: searchTerm,
                        apiKey: MAP_API_KEY
                    },
                })
                if (response) {
                    setResults(response.data.features)
                    console.log("Response: ", response.data.features)
                } else {
                    console.log("Failed To Fetch data")
                }
            } catch (error) {
                console.log("Error: ", error)
            }
        }, 500);

        return () => clearTimeout(debounceDelay);
    }, [searchTerm]);


    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[centerCoords.lat, centerCoords.lng]}
                zoom={20}
                zoomControl={false}
                scrollWheelZoom={false}
                whenReady={() => handleMapReady()}
                ref={(instance) => {
                    if (instance) {
                        mapRef.current = instance;
                    }
                }}
                className="w-full h-full z-0 rounded-lg"
            >
                <ResizeMapOnModalOpen />
                <TileLayer
                    url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${MAP_API_KEY}`}
                />
                <LocationUpdater setCenterCoords={setCenterCoords} />
                <RecenterMap lat={centerCoords.lat} lng={centerCoords.lng} />
                <ZoomControl position="bottomleft" />
            </MapContainer>

            <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="location icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none h-8 w-8"
            />

            <div className="absolute top-3 left-4 right-4 transform bg-white px-0 py-2 rounded shadow-lg z-10">
                <div className='relative flex items-center justify-start w-full h-full px-4'>
                    <LuSearch className='h-5 w-5' />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchTerm(val);
                            setInput(val)
                        }}
                        placeholder='Search Location'
                        className='py-1.5 px-4 w-full outline-none'
                    />
                    <button onClick={() => { setSelectedAddress(null); setInput('') }}><LuX /></button>

                    {results.length > 0 &&
                        <div className='absolute left-0 right-0 w-full top-10 bg-white border'>
                            <div>
                                {results.slice(0, 5).map((item, index) =>
                                    <button
                                        key={index}
                                        onClick={() => { setSelectedAddress(item); console.log(selectedAddress) }}
                                        className='w-full px-4 py-2 text-left font-poppins text-sm hover:bg-gray-50'
                                    >
                                        {item.properties.formatted}
                                    </button>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white min-w-[20rem] px-4 py-2 rounded shadow-lg z-10">
                <p className="text-xs font-medium text-gray-700 text-center">{address}</p>
            </div>
        </div>
    );
};

export default MapWithCenterPointer;
