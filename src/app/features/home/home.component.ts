import { Component, computed, inject, signal } from '@angular/core';
import { CurrentWeather, DailyForecastItem, GeoCity, HourlyForecastItem, SavedCity } from '../../core/models/weather.model';
import { WeatherService } from '../../core/services/weather.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { SavedCitiesService } from '../../core/services/saved-cities.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CurrentWeatherComponent } from '../../shared/components/current-weather/current-weather.component';
import { HourlyForecastComponent } from '../../shared/components/hourly-forecast/hourly-forecast.component';
import { WeeklyForecastComponent } from '../../shared/components/weekly-forecast/weekly-forecast.component';
import { DetailsGridComponent } from '../../shared/components/details-grid/details-grid.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

const LAST_LOCATION_KEY = 'weather-app-last-location';
const DEFAULT_CITY = { lat: 30.0444, lon: 31.2357, name: 'Cairo', country: 'EG' }; // fallback

type ForecastTab = 'hourly' | 'weekly';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslatePipe,
    SearchBarComponent,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    WeeklyForecastComponent,
    DetailsGridComponent,
    LoadingComponent,
    ErrorMessageComponent,
    ThemeToggleComponent,
    BottomNavComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private weatherService = inject(WeatherService);
  private geo = inject(GeolocationService);
  private savedCities = inject(SavedCitiesService);
  i18n = inject(I18nService);

  loading = signal(true);
  errorKey = signal<string | null>(null);

  current = signal<CurrentWeather | null>(null);
  hourly = signal<HourlyForecastItem[]>([]);
  daily = signal<DailyForecastItem[]>([]);
  uvIndex = signal<number | null>(null);
  aqi = signal<number | null>(null);

  tab = signal<ForecastTab>('hourly');

  isSaved = computed(() => {
    const c = this.current();
    return c ? this.savedCities.isSaved(this.cityId(c.lat, c.lon)) : false;
  });

  hasApiKey = this.weatherService.hasApiKey();

  constructor() {
    this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    const last = this.readLastLocation();
    if (last) {
      this.loadWeather(last.lat, last.lon);
      return;
    }
    await this.useCurrentLocation(true);
  }

  onCitySelected(city: GeoCity): void {
    this.loadWeather(city.lat, city.lon);
  }

  async useCurrentLocation(isBootstrap = false): Promise<void> {
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      const pos = await this.geo.getCurrentPosition();
      this.loadWeather(pos.lat, pos.lon);
    } catch (err) {
      if (isBootstrap) {
        // Silent fallback to a default city on first load so the app isn't empty.
        this.loadWeather(DEFAULT_CITY.lat, DEFAULT_CITY.lon);
        return;
      }
      this.loading.set(false);
      this.errorKey.set(err === 'denied' ? 'error.geoDenied' : 'error.geoUnavailable');
    }
  }

  private loadWeather(lat: number, lon: number): void {
    this.loading.set(true);
    this.errorKey.set(null);

    this.weatherService.getWeatherBundle(lat, lon).subscribe({
      next: (bundle) => {
        this.current.set(bundle.current);
        this.hourly.set(bundle.hourly);
        this.daily.set(bundle.daily);
        this.uvIndex.set(bundle.uvIndex);
        this.aqi.set(bundle.aqi);
        this.loading.set(false);
        this.persistLastLocation(lat, lon);
      },
      error: () => {
        this.loading.set(false);
        this.errorKey.set(this.hasApiKey ? 'error.generic' : 'error.apiKey');
      },
    });
  }

  retry(): void {
    const c = this.current();
    if (c) {
      this.loadWeather(c.lat, c.lon);
    } else {
      this.bootstrap();
    }
  }

  toggleSave(): void {
    const c = this.current();
    if (!c) return;
    const id = this.cityId(c.lat, c.lon);
    if (this.savedCities.isSaved(id)) {
      this.savedCities.remove(id);
    } else {
      const city: SavedCity = { id, name: c.cityName, country: c.country, lat: c.lat, lon: c.lon };
      this.savedCities.add(city);
    }
  }

  setTab(tab: ForecastTab): void {
    this.tab.set(tab);
  }

  private cityId(lat: number, lon: number): string {
    return `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  }

  private persistLastLocation(lat: number, lon: number): void {
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ lat, lon }));
  }

  private readLastLocation(): { lat: number; lon: number } | null {
    try {
      const raw = localStorage.getItem(LAST_LOCATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
