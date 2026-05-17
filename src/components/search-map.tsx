"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { SearchYard } from "./search-results";
import { useMemo } from "react";

function priceIcon(price: number, active: boolean) {
  return L.divIcon({
    className: "barkyard-price-marker",
    html: `<div style="background:${active ? "#0f172a" : "#ffffff"};color:${active ? "#ffffff" : "#0f172a"};border:1px solid ${active ? "#0f172a" : "#e5e7eb"};box-shadow:0 2px 8px rgba(0,0,0,0.12);padding:6px 10px;border-radius:9999px;font-size:13px;font-weight:600;white-space:nowrap;">$${price}</div>`,
    iconSize: [40, 28],
    iconAnchor: [20, 14],
  });
}

export default function SearchMap({
  yards,
  hoverId,
}: {
  yards: SearchYard[];
  hoverId: string | null;
}) {
  const center = useMemo<[number, number]>(() => {
    if (yards.length === 0) return [45.5, -122.6];
    const avgLat = yards.reduce((s, y) => s + y.lat, 0) / yards.length;
    const avgLng = yards.reduce((s, y) => s + y.lng, 0) / yards.length;
    return [avgLat, avgLng];
  }, [yards]);

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {yards.map((y) => (
        <Marker
          key={y.id}
          position={[y.lat, y.lng]}
          icon={priceIcon(y.pricePerHour, hoverId === y.id)}
        >
          <Popup>
            <Link href={`/yards/${y.id}`} className="block">
              <div className="font-semibold text-sm">{y.title}</div>
              <div className="text-xs text-gray-600">
                {y.neighborhood}, {y.city}
              </div>
              <div className="text-xs mt-1">${y.pricePerHour} / hour</div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
