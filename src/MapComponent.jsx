import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// 🔴 Custom Red Marker for User's Location
const redMarker = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/447/447031.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Component to adjust map view automatically
const MapUpdater = ({ currentCoords, destinationCoords, userLocation }) => {
    const map = useMap();

    useEffect(() => {
        if (currentCoords && destinationCoords) {
            map.fitBounds([currentCoords, destinationCoords], { padding: [50, 50] });
        } else if (userLocation) {
            map.setView(userLocation, 12);
        }
    }, [currentCoords, destinationCoords, userLocation, map]);

    return null;
};

const MapComponent = ({ currentCoords, destinationCoords, setUserLocation }) => {
    const [userCoords, setUserCoords] = useState(null);
    const [userLocationName, setUserLocationName] = useState("Fetching...");

    // Function to get location name from coordinates
    const fetchLocationName = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            if (data.display_name) {
                setUserLocationName(data.display_name.split(",")[0]); // Show only city/town name
            } else {
                setUserLocationName("Unknown Location");
            }
        } catch (error) {
            console.error("Error fetching location name:", error);
            setUserLocationName("Error fetching location");
        }
    };

    // Get user's live location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoords([latitude, longitude]);
                    setUserLocation([latitude, longitude]); // Send data to parent component if needed
                    fetchLocationName(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setUserLocationName("Location Access Denied");
                },
                { enableHighAccuracy: true }
            );
        }
    }, [setUserLocation]);

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <MapContainer center={[20, 78]} zoom={5} className="map">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapUpdater currentCoords={currentCoords} destinationCoords={destinationCoords} userLocation={userCoords} />

                    {/* 🔴 Mark User's Actual Location */}
                    {userCoords && (
                        <Marker position={userCoords} icon={redMarker}>
                            <Popup>📍 You are here: {userLocationName}</Popup>
                        </Marker>
                    )}

                    {/* Draw a blue line between current and destination locations */}
                    {currentCoords && destinationCoords && (
                        <Polyline positions={[currentCoords, destinationCoords]} color="blue" />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
