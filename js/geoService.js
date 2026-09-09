/**
 * Saksham Geolocation & Mapping Service
 * Real-time GPS coordinates via navigator.geolocation, OpenStreetMap reverse geocoding, and distance calculations.
 */

class GeoService {
  constructor() {
    this.currentCoords = null; // [lat, lng]
    this.currentAddress = "Locating your live position...";
    this.hasLocation = false;
  }

  /**
   * Request live GPS position from the browser
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.hasLocation = true;

          // Attempt reverse geocoding to get real city / locality name
          try {
            const address = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            this.currentAddress = address;
          } catch (err) {
            console.warn("Reverse geocode failed:", err);
            this.currentAddress = `GPS (${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° E)`;
          }

          resolve({
            coords: this.currentCoords,
            address: this.currentAddress
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Fallback to default location
          this.currentCoords = { latitude: 28.6139, longitude: 77.2090, accuracy: 100 };
          this.currentAddress = "Connaught Place, New Delhi (Default Location)";
          resolve({
            coords: this.currentCoords,
            address: this.currentAddress,
            isFallback: true
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  }

  /**
   * Free OpenStreetMap Nominatim Reverse Geocoding
   */
  async reverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Saksham-Support-Platform/1.0'
        }
      });
      if (!res.ok) throw new Error("Geocoding service unavailable");
      const data = await res.json();
      
      const addr = data.address || {};
      const locality = addr.suburb || addr.neighbourhood || addr.road || addr.village || addr.city_district || "";
      const city = addr.city || addr.town || addr.state_district || "";
      const state = addr.state || "";
      const postcode = addr.postcode ? ` - ${addr.postcode}` : "";

      const parts = [locality, city, state].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") + postcode : data.display_name.split(",").slice(0, 3).join(",");
    } catch (e) {
      return `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    }
  }

  /**
   * Calculate distance between two coordinates in km (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  }
}

// Global instance
window.geoService = new GeoService();
