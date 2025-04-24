import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon untuk marker (agar tidak error karena default marker Leaflet tidak ter-load)
const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const MapComponent = ({ latitude, longitude }) => {
    return (
        <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: "300px", width: "100%", borderRadius: "10px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} icon={customIcon}>
                <Popup>Lokasi Absensi</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
