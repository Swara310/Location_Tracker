import { useState } from "react";
import MapComponent from "./MapComponent";
import "./App.css";

function App() {
    const [currentLocation, setCurrentLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [currentCoords, setCurrentCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [distance, setDistance] = useState(null);

    const handleShowRoute = () => {
        Promise.all([
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${currentLocation}`)
                .then((res) => res.json()),
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destination}`)
                .then((res) => res.json()),
        ])
            .then(([currentData, destData]) => {
                if (currentData.length > 0 && destData.length > 0) {
                    const currCoords = [parseFloat(currentData[0].lat), parseFloat(currentData[0].lon)];
                    const destCoords = [parseFloat(destData[0].lat), parseFloat(destData[0].lon)];

                    setCurrentCoords(currCoords);
                    setDestinationCoords(destCoords);
                    calculateDistance(currCoords, destCoords);
                }
            });
    };

    const calculateDistance = (coord1, coord2) => {
        const R = 6371;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(coord2[0] - coord1[0]);
        const dLon = toRad(coord2[1] - coord1[1]);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        setDistance((R * c).toFixed(2));
    };

    // Switch Button Functionality
    const handleSwitchLocations = () => {
        setCurrentLocation(destination);
        setDestination(currentLocation);
    };

    return (
        <div className="app-container">
            <h2>📍 Location Tracker</h2>
            
            <div className="input-section">
                <div className="input-group">
                    <label>Current Location:</label>
                    <textarea
                        rows="2"
                        placeholder="Enter your current location"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                    />
                </div>

                <button className="switch-btn" onClick={handleSwitchLocations}>⇅ Switch</button>

                <div className="input-group">
                    <label>Destination:</label>
                    <textarea
                        rows="2"
                        placeholder="Enter your destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            <button onClick={handleShowRoute}>Track Location</button>

            {distance !== null && (
                <p className="distance-label">📍 Distance: <strong>{distance} km</strong></p>
            )}

            <MapComponent currentCoords={currentCoords} destinationCoords={destinationCoords} />
        </div>
    );
}

export default App;
