import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CurrentWeather,
  DailyForecastItem,
  GeoCity,
  HourlyForecastItem,
  WeatherBundle,
} from '../models/weather.model';

interface OwmWeatherResponse {
  id: number;
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number; deg: number };
  visibility: number;
  weather: { main: string; description: string; icon: string }[];
  rain?: { '1h'?: number };
  timezone: number;
  dt: number;
}

interface OwmForecastListItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { main: string; description: string; icon: string }[];
  pop: number;
  dt_txt: string;
}

interface OwmForecastResponse {
  list: OwmForecastListItem[];
  city: { timezone: number; sunrise: number; sunset: number };
}

interface OwmGeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private base = environment.openWeatherBaseUrl;
  private geoBase = environment.openWeatherGeoUrl;
  private key = environment.openWeatherApiKey;

  /** Whether a real OpenWeatherMap API key has been configured. */
  hasApiKey(): boolean {
    return !!this.key && this.key !== 'YOUR_OPENWEATHERMAP_API_KEY';
  }

  /** Search cities by name (autocomplete) using the free Geocoding API. */
  searchCities(query: string, lang: string) {
    if (!query || query.trim().length < 2) {
      return of<GeoCity[]>([]);
    }
    const url = `${this.geoBase}/direct?q=${encodeURIComponent(
      query
    )}&limit=6&appid=${this.key}`;
    return this.http.get<OwmGeoResult[]>(url).pipe(
      map((results) =>
        results.map((r) => ({
          name: r.local_names?.[lang] ?? r.name,
          localNames: r.local_names,
          lat: r.lat,
          lon: r.lon,
          country: r.country,
          state: r.state,
        }))
      ),
      catchError(() => of<GeoCity[]>([]))
    );
  }

  /** Reverse geocode coordinates into a friendly city name. */
  reverseGeocode(lat: number, lon: number, lang: string) {
    const url = `${this.geoBase}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.key}`;
    return this.http.get<OwmGeoResult[]>(url).pipe(
      map((results) => {
        const r = results[0];
        return r
          ? ({
              name: r.local_names?.[lang] ?? r.name,
              localNames: r.local_names,
              lat: r.lat,
              lon: r.lon,
              country: r.country,
              state: r.state,
            } as GeoCity)
          : null;
      }),
      catchError(() => of(null))
    );
  }

  /** Fetch current weather + hourly + 5-day forecast in one bundle. */
  getWeatherBundle(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') {
    const currentUrl = `${this.base}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.key}`;
    const forecastUrl = `${this.base}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.key}`;
    const uvUrl = `${this.base}/uvi?lat=${lat}&lon=${lon}&appid=${this.key}`;

    const aqiUrl = `${this.base}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.key}`;

    return forkJoin({
      current: this.http.get<OwmWeatherResponse>(currentUrl),
      forecast: this.http.get<OwmForecastResponse>(forecastUrl),
      uv: this.http.get<{ value: number }>(uvUrl).pipe(
        map((r) => r.value),
        catchError(() => of(null)) // UV endpoint is not available on every plan; degrade gracefully
      ),
      aqi: this.http.get<{ list: { main: { aqi: number } }[] }>(aqiUrl).pipe(
        map((r) => r.list[0]?.main.aqi ?? null),
        catchError(() => of(null))
      ),
    }).pipe(
      map(({ current, forecast, uv, aqi }) => this.mapBundle(current, forecast, uv, aqi))
    );
  }

  private mapBundle(
    current: OwmWeatherResponse,
    forecast: OwmForecastResponse,
    uv: number | null,
    aqi: number | null
  ): WeatherBundle & { uvIndex: number | null; aqi: number | null } {
    const currentWeather: CurrentWeather = {
      cityId: current.id,
      cityName: current.name,
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempMin: Math.round(current.main.temp_min),
      tempMax: Math.round(current.main.temp_max),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: current.visibility,
      windSpeed: Math.round(current.wind.speed * 3.6 * 10) / 10, // m/s -> km/h
      windDeg: current.wind.deg,
      condition: current.weather[0]?.main ?? '',
      description: current.weather[0]?.description ?? '',
      icon: current.weather[0]?.icon ?? '01d',
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      timezone: current.timezone,
      dt: current.dt,
      rain1h: current.rain?.['1h'],
    };

    const hourly: HourlyForecastItem[] = forecast.list.slice(0, 8).map((item) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
      icon: item.weather[0]?.icon ?? '01d',
      condition: item.weather[0]?.main ?? '',
      pop: item.pop ?? 0,
    }));

    const daily = this.buildDaily(forecast.list, forecast.city.timezone);

    return {
      current: currentWeather,
      hourly,
      daily,
      uvIndex: uv !== null && uv !== undefined ? Math.round(uv) : null,
      aqi,
    };
  }

  /** Group 3-hour forecast entries by local date to approximate a daily forecast. */
  private buildDaily(list: OwmForecastListItem[], tzOffsetSeconds: number): DailyForecastItem[] {
    const groups = new Map<string, OwmForecastListItem[]>();

    for (const item of list) {
      const localMs = (item.dt + tzOffsetSeconds) * 1000;
      const dateKey = new Date(localMs).toISOString().slice(0, 10);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(item);
    }

    const days: DailyForecastItem[] = [];
    for (const [date, items] of groups.entries()) {
      const temps = items.map((i) => i.main.temp);
      const middayItem =
        items.find((i) => i.dt_txt.includes('12:00:00')) ?? items[Math.floor(items.length / 2)];

      days.push({
        date,
        dayLabel: new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
          weekday: 'short',
        }),
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        icon: middayItem.weather[0]?.icon ?? '01d',
        condition: middayItem.weather[0]?.main ?? '',
        pop: Math.max(...items.map((i) => i.pop ?? 0)),
      });
    }

    return days.slice(0, 5);
  }
}
