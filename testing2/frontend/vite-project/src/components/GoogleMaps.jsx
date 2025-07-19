import { GoogleMap, LoadScript } from '@react-google-maps/api';

<LoadScript googleMapsApiKey={import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
  <GoogleMap
    center={{ lat: 12.9716, lng: 77.5946 }}
    zoom={13}
    mapContainerStyle={{ width: '100%', height: '400px' }}
  >
    {/* Your markers here */}
  </GoogleMap>
</LoadScript>
