# Location Picker Component

## Overview
The LocationPicker component allows users to auto-fill their shipping address at checkout using their current location.

## Features
- **Get Current Location**: Uses browser's Geolocation API to get user's GPS coordinates
- **Reverse Geocoding**: Converts coordinates to a physical address using OpenStreetMap Nominatim API
- **Auto-fill Address Form**: Automatically populates address, city, state, postal code, and country fields
- **Error Handling**: Handles permission denials, timeouts, and API errors gracefully
- **Loading States**: Shows visual feedback while fetching location and address

## How It Works

1. **User Clicks Button**: "Use My Current Location" button triggers the location request
2. **Browser Permission**: Browser asks for location permission
3. **Get Coordinates**: GPS coordinates (latitude, longitude) are obtained
4. **Reverse Geocoding**: Coordinates are sent to OpenStreetMap API to get address details
5. **Auto-fill Form**: Address fields are automatically populated with the returned data

## Usage

```tsx
import LocationPicker from '@/components/LocationPicker';

const [address, setAddress] = useState('');
const [city, setCity] = useState('');
const [state, setState] = useState('');
const [postalCode, setPostalCode] = useState('');
const [country, setCountry] = useState('');

const handleAddressSelect = (locationAddress: Address) => {
  setAddress(locationAddress.street || locationAddress.fullAddress);
  setCity(locationAddress.city);
  setState(locationAddress.state);
  setPostalCode(locationAddress.postalCode);
  setCountry(locationAddress.country);
};

<LocationPicker onAddressSelect={handleAddressSelect} />
```

## API Used
- **OpenStreetMap Nominatim**: Free reverse geocoding API (no API key required)
- Endpoint: `https://nominatim.openstreetmap.org/reverse`
- Usage Policy: Please review [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

## Browser Compatibility
- Requires HTTPS (except localhost)
- Supported by all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-friendly (works on iOS and Android)

## Privacy & Security
- User must explicitly grant location permission
- Location data is only sent to OpenStreetMap API for geocoding
- No location data is stored by the application
- Users can manually edit the auto-filled address

## Error Handling
The component handles various error scenarios:
- **Permission Denied**: User denies location access
- **Position Unavailable**: GPS hardware/service unavailable
- **Timeout**: Location request takes too long (10 second timeout)
- **Geocoding Failed**: Unable to convert coordinates to address

## Customization
You can customize the component by:
- Changing button styles
- Using different geocoding APIs (Google Maps, Mapbox, etc.)
- Adjusting timeout and accuracy settings
- Modifying address field mapping logic

## Testing
To test the component:
1. Make sure your app is running on HTTPS or localhost
2. Navigate to the checkout page
3. Click "Use My Current Location"
4. Allow location access when prompted
5. Verify address fields are auto-filled correctly
6. Test manual editing of auto-filled fields

## Notes
- First request may take 2-5 seconds depending on GPS accuracy
- Accuracy varies by device and environment (indoor vs outdoor)
- OpenStreetMap data quality varies by region
- Consider rate limiting to respect API usage policies
