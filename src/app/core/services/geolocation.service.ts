import { Injectable } from '@angular/core';

export type GeoErrorKind = 'denied' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject('unavailable' as GeoErrorKind);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }
}
