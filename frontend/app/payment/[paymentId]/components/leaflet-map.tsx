"use client";

import { useEffect, useRef, useState } from "react";

interface LeafletMapProps {
  merchantLat: number;
  merchantLng: number;
  merchantName: string;
}

export default function LeafletMap({
  merchantLat,
  merchantLng,
  merchantName,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Load Leaflet CSS if not already loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // 2. Load Leaflet JS if not already loaded
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else {
      if ((window as any).L) {
        setLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || !(window as any).L) return;

    const L = (window as any).L;

    // Use simulated buyer location close to merchant
    const buyerLat = merchantLat - 0.004;
    const buyerLng = merchantLng + 0.004;

    // Initialize map
    const map = L.map(mapRef.current).setView([merchantLat, merchantLng], 14);

    // Set tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom HTML Icons using SVG (Clean & Modern)
    const storeIcon = L.divIcon({
      html: `<div class="bg-[#fd6700] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center w-8 h-8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const homeIcon = L.divIcon({
      html: `<div class="bg-[#cb3600] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center w-8 h-8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const vespaIcon = L.divIcon({
      html: `<div class="bg-amber-500 text-white p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center w-8 h-8 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C20.3 11 20 10.3 20 9.5V6a2 2 0 0 0-2-2H9c-.6 0-1 .4-1 1v6c0 .6-.4 1-1 1H5a2 2 0 0 0-2 2v2c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M13 13V6"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add Merchant Marker
    L.marker([merchantLat, merchantLng], { icon: storeIcon })
      .addTo(map)
      .bindPopup(`<b>${merchantName}</b> (Toko)`)
      .openPopup();

    // Add Buyer Marker
    L.marker([buyerLat, buyerLng], { icon: homeIcon })
      .addTo(map)
      .bindPopup("<b>Lokasi Anda</b> (Tujuan)");

    // Draw route line (polyline)
    const latlngs = [
      [merchantLat, merchantLng],
      [merchantLat - 0.001, merchantLng + 0.001],
      [merchantLat - 0.002, merchantLng + 0.002],
      [merchantLat - 0.003, merchantLng + 0.003],
      [buyerLat, buyerLng]
    ];
    
    L.polyline(latlngs, { color: "#fd6700", weight: 5, opacity: 0.8 }).addTo(map);

    // Place the driver marker along the route (simulating mid-journey!)
    L.marker(latlngs[2], { icon: vespaIcon })
      .addTo(map)
      .bindPopup("<b>Kurir Mamat</b> (Sedang Mengantar)");

    // Fit map to show both points
    const bounds = L.latLngBounds([
      [merchantLat, merchantLng],
      [buyerLat, buyerLng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [loaded, merchantLat, merchantLng, merchantName]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm">
      {!loaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground font-medium animate-pulse">
          Memuat Peta Interaktif...
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-10" />
    </div>
  );
}
