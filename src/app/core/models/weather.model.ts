export interface GeoCity {
  name: string;
  localNames?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  cityId: number;
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number; // meters
  windSpeed: number; // km/h
  windDeg: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: number; // unix seconds
  sunset: number; // unix seconds
  timezone: number; // offset seconds
  dt: number; // unix seconds
  rain1h?: number; // mm
}

export interface HourlyForecastItem {
  dt: number;
  temp: number;
  icon: string;
  condition: string;
  pop: number; // probability of precipitation 0-1
}

export interface DailyForecastItem {
  date: string; // ISO date (yyyy-MM-dd)
  dayLabel: string; // Mon / Tue ...
  tempMin: number;
  tempMax: number;
  icon: string;
  condition: string;
  pop: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface SavedCity {
  id: string; // `${lat}_${lon}`
  name: string;
  country: string;
  lat: number;
  lon: number;
}
