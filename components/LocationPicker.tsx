'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullAddress: string;
}

interface LocationPickerProps {
  onAddressSelect: (address: Address) => void;
}

export default function LocationPicker({ onAddressSelect }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<Address | null> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'E-Commerce-App', // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      const addr = data.address;

      // Extract address components
      const street = addr.road || addr.street || addr.suburb || '';
      const city = addr.city || addr.town || addr.village || addr.municipality || '';
      const state = addr.state || addr.province || '';
      const country = addr.country || '';
      const postalCode = addr.postcode || '';

      // Build full address
      const addressParts = [
        addr.house_number,
        street,
        addr.suburb,
        city,
        state,
        postalCode,
        country,
      ].filter(Boolean);

      return {
        street,
        city,
        state,
        country,
        postalCode,
        fullAddress: addressParts.join(', '),
      };
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      throw new Error('Failed to convert location to address');
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Location obtained:', { latitude, longitude });

          const address = await reverseGeocode(latitude, longitude);

          if (address) {
            onAddressSelect(address);
          } else {
            setError('Could not determine address from location');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to get address');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
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
    <div className="mb-4">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Getting Location...</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            <span>Use My Current Location</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Click to auto-fill your address based on your current location
      </p>
    </div>
  );
}
