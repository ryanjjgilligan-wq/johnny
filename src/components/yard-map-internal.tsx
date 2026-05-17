"use client";

import { MapContainer, TileLayer, Circle, Marker } from "react-leaflet";
import L from "leaflet";

// Customize default icon for environments without _getIconUrl
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function YardMapInternal({
  center,
  approximate = true,
  label,
}: {
  center: { lat: number; lng: number };
  approximate?: boolean;
  label?: string;
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {approximate ? (
        <Circle
          center={[center.lat, center.lng]}
          radius={400}
          pathOptions={{
            color: "#FF5A5F",
            fillColor: "#FF5A5F",
            fillOpacity: 0.18,
            weight: 2,
          }}
        />
      ) : (
        <Marker position={[center.lat, center.lng]}>
          {label ? (
            <></>
          ) : null}
        </Marker>
      )}
    </MapContainer>
  );
}
