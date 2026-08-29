import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SavedCitiesService } from '../../core/services/saved-cities.service';
import { WeatherService } from '../../core/services/weather.service';
import { CurrentWeather, GeoCity, SavedCity } from '../../core/models/weather.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { weatherEmoji } from '../../core/utils/weather-icon.util';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

interface SavedCityWeather {
  city: SavedCity;
  weather: CurrentWeather | null;
}

@Component({
  selector: 'app-saved-cities',
  standalone: true,
  imports: [TranslatePipe, SearchBarComponent, ThemeToggleComponent, LoadingComponent, BottomNavComponent],
  templateUrl: './saved-cities.component.html',
  styleUrl: './saved-cities.component.css',
})
export class SavedCitiesComponent {
  private savedCitiesService = inject(SavedCitiesService);
  private weatherService = inject(WeatherService);
  router = inject(Router);

  loading = signal(true);
  rows = signal<SavedCityWeather[]>([]);
  emoji = weatherEmoji;

  isEmpty = computed(() => !this.loading() && this.rows().length === 0);

  constructor() {
    this.load();
  }

  private load(): void {
    const cities = this.savedCitiesService.cities();
    if (!cities.length) {
      this.rows.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const requests = cities.map((city) =>
      this.weatherService.getWeatherBundle(city.lat, city.lon).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe((results) => {
      this.rows.set(
        cities.map((city, i) => ({ city, weather: results[i]?.current ?? null }))
      );
      this.loading.set(false);
    });
  }

  remove(id: string, event: Event): void {
    event.stopPropagation();
    this.savedCitiesService.remove(id);
    this.load();
  }

  openCity(city: SavedCity): void {
    localStorage.setItem(
      'weather-app-last-location',
      JSON.stringify({ lat: city.lat, lon: city.lon })
    );
    this.router.navigateByUrl('/');
  }

  onCitySelected(city: GeoCity): void {
    localStorage.setItem(
      'weather-app-last-location',
      JSON.stringify({ lat: city.lat, lon: city.lon })
    );
    this.router.navigateByUrl('/');
  }
}
