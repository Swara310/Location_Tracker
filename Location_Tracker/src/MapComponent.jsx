import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon
const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/447/447031.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapComponent = ({ currentCoords, destinationCoords }) => {
    return (
        <div className="map-container">
            <MapContainer center={[20, 78]} zoom={5} className="map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {currentCoords && (
                    <Marker position={currentCoords} icon={customIcon}>
                        <Popup>Current Location</Popup>
                    </Marker>
                )}

                {destinationCoords && (
                    <Marker position={destinationCoords} icon={customIcon}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
