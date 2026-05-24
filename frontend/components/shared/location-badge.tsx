"use client";

import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import Location from "../icons/location";

interface LocationBadgeProps {
  onLocationChange?: (location: string) => void;
}

const LocationBadge = ({ onLocationChange }: LocationBadgeProps) => {
  const [location, setLocation] = useState<string>("Lokasi Saya");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      // Using Nominatim OpenStreetMap API for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();

      // Extract city or subdistrict name
      const locationName =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.state_district ||
        "Lokasi Tidak Diketahui";

      return locationName;
    } catch (error) {
      console.error("Error getting location name:", error);
      return "Lokasi Tidak Diketahui";
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini");
      return;
    }

    setIsLoading(true);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);

        setLocation(locationName);
        setIsLoading(false);

        if (onLocationChange) {
          onLocationChange(locationName);
        }
      },
      (error) => {
        setIsLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
          alert(
            "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser Anda untuk menggunakan fitur ini."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert("Informasi lokasi tidak tersedia");
        } else if (error.code === error.TIMEOUT) {
          alert("Request timeout untuk mendapatkan lokasi");
        } else {
          alert("Terjadi error saat mendapatkan lokasi");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Badge
      onClick={requestLocation}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 
        bg-white border-2 border-primary text-primary 
        hover:bg-primary hover:text-white 
        cursor-pointer transition-all duration-200
        text-xs md:text-sm font-medium
        ${isLoading ? "opacity-60 cursor-wait" : ""}
        ${
          permissionDenied
            ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            : ""
        }
      `}
    >
      <Location className="w-3 h-3 md:w-4 md:h-4" />
      <span>{isLoading ? "Memuat..." : location}</span>
    </Badge>
  );
};

export default LocationBadge;
