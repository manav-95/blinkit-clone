import { FaX } from "react-icons/fa6"
import { IoLocationOutline } from "react-icons/io5";
import { useLocation } from "../contexts/LocationContext"
import { useEffect, useRef, useState } from "react";
import axios from "axios";


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


const LocationWindow = () => {

    const { setOpenLocationBox, setSelectedLocation, setEstimatedTime } = useLocation();

    const modalRef = useRef<HTMLDivElement | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<LocationFeature[]>([]);
    const [openProcessingModal, setOpenProcessingModal] = useState<boolean>(false);

    // Debouncing
    useEffect(() => {
        const debounceDelay = setTimeout(async () => {

            if (searchTerm.length < 2) return;

            try {
                const response = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
                    params: {
                        text: searchTerm,
                        apiKey: "ecad8017a2fa45cd81a9294fa8cb93ff", // ← use your key here
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


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setOpenLocationBox(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpenLocationBox])

    // Function to Get Distance and Time Between Our Location and Store Location
    const getRoute = async (lat: number, lon: number) => {
        const storeCoords = { lat: 21.3857108, lon: 78.4048318 };
        const url = `https://api.geoapify.com/v1/routing?waypoints=${lat},${lon}|${storeCoords.lat},${storeCoords.lon}&mode=drive&apiKey=ecad8017a2fa45cd81a9294fa8cb93ff`;
        try {
            const res = await axios.get(url);
            if (res.data && res.data.features && res.data.features.length > 0) {
                const route = res.data.features[0].properties;
                const TimeMin = Math.round(route.time / 60);
                setEstimatedTime(TimeMin.toString());
                console.log("Estimated Time:", TimeMin);
            } else {
                console.warn("No route found.");
            }
        } catch (error) {
            console.error("GetRouting Error:", error);
        }
    };

    // Function to Get Our Current Formatted Location Address
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (position: GeolocationPosition) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const res = await axios.get("https://api.geoapify.com/v1/geocode/reverse", {
                        params: {
                            lat,
                            lon,
                            apiKey: 'ecad8017a2fa45cd81a9294fa8cb93ff',
                        },
                    });
                    if (res.data.features.length > 0) {
                        const foundedLocation = res.data.features[0].properties.formatted;
                        const foundedCoordinates = res.data.features[0].geometry.coordinates;
                        setSelectedLocation(foundedLocation);
                        //console.log("Founded Location: ", foundedLocation)
                        //console.log("Founded Coordinates: ", foundedCoordinates)
                        localStorage.setItem("selectedLocation", foundedLocation)
                        localStorage.setItem("selectedLocationCoordinates", foundedCoordinates.join(','))
                        getRoute(lat, lon);

                        setTimeout(() => {
                            setOpenLocationBox(false);
                        }, 1000);
                    } else {
                        console.warn("No Location Found");
                    }
                } catch (error) {
                    console.error("Reverse Geocoding Failed: ", error);
                }
            },
            (error: GeolocationPositionError) => {
                console.error("Error Getting Your Location/Position: ", error);
            }

        );
    }



    return (
        <>
            <div className="absolute top-[5.4rem] left-28 ">
                <div ref={modalRef} className="max-w-[550px]">

                    {openProcessingModal ? (
                        <>
                            <div className="relative bg-slate-100 shadow-xl p-6">
                                <div className="flex items-center space-x-1 min-w-[550px] poppins mb-3.5">
                                    <span>Welcome to</span>
                                    <span className="text-darkGreen">shopit</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg poppins">processing</span>
                                    <div className="h-5 w-5 border-4 border-darkGreen border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative bg-slate-100 shadow-xl p-6">
                                <div className="absolute right-2 top-2">
                                    <button onClick={() => setOpenLocationBox(false)} className="p-2">
                                        <FaX className="flex-shrink-0 h-3 w-3" />
                                    </button>
                                </div>
                                <div className="mb-3.5">
                                    <span className="font-medium text-gray-900 poppins">Change Location</span>
                                </div>
                                <div className="flex justify-start items-center space-x-4">
                                    <button onClick={() => { getCurrentLocation(); setOpenProcessingModal(true); }} className="px-4 py-2.5 rounded bg-darkGreen hover:bg-lime-600 text-white text-xs poppins tracking-wide">
                                        Detect My Location
                                    </button>
                                    <div className="relative h-[2.5px] border w-16 flex justify-center items-center bg-gray-300">
                                        <div className="absolute rounded-full p-2 bg-white poppins text-[#999] text-xs border border-gray-400">
                                            OR
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="search delivery location"
                                        className="border border-gray-400 outline-none rounded px-4 py-1.5 placeholder:text-sm placeholder:text-gray-600 poppins text-sm"
                                    />
                                </div>
                            </div>


                            <div className="min-w-full mt-0 bg-white flex flex-col px-4 py-0 -translate-y-0.5 max-h-[400px] overflow-y-auto">
                                <>
                                    {results.slice(0, 5).map((item: LocationFeature, index: number) => (
                                        <button onClick={() => {
                                            setOpenLocationBox(false);
                                            setSelectedLocation(item.properties.formatted);
                                            // console.log("Selected Text: ", item.properties.formatted)
                                            localStorage.setItem("selectedLocation", item.properties.formatted)
                                            localStorage.setItem("selectedLocationCoordinates", item.geometry.coordinates.join(','))

                                            // Destructure and call getRoute directly
                                            const [lon, lat] = item.geometry.coordinates;
                                            getRoute(lat, lon); // ✅ Call directly for instant update

                                        }
                                        }
                                            key={index}
                                            className="flex items-center py-4 border-b"
                                        >
                                            <div className="w-2/12 flex items-center justify-center">
                                                <IoLocationOutline className="flex-shrink-0 h-5 w-5" />
                                            </div>
                                            <div className="w-full flex flex-col items-start text-start">
                                                <span className="poppins mb-0.5">{item.properties.formatted}</span>
                                                <span className="poppins text-sm font-light">{item.properties.formatted}</span>
                                                <span className="poppins text-sm font-light">{item.geometry.coordinates}</span>
                                            </div>
                                        </button>
                                    ))}
                                </>
                            </div>

                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default LocationWindow