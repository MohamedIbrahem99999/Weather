import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { GeoCity } from '../../../core/models/weather.model';
import { WeatherService } from '../../../core/services/weather.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private weather = inject(WeatherService);
  private i18n = inject(I18nService);

  @Output() citySelected = new EventEmitter<GeoCity>();
  @Output() useLocation = new EventEmitter<void>();

  query = '';
  results = signal<GeoCity[]>([]);
  isOpen = signal(false);
  private query$ = new Subject<string>();

  constructor() {
    this.query$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.weather.searchCities(q, this.i18n.lang()))
      )
      .subscribe((results) => {
        this.results.set(results);
        this.isOpen.set(true);
      });
  }

  onInput(value: string): void {
    this.query = value;
    if (!value || value.trim().length < 2) {
      this.results.set([]);
      this.isOpen.set(false);
      return;
    }
    this.query$.next(value);
  }

  select(city: GeoCity): void {
    this.query = `${city.name}, ${city.country}`;
    this.isOpen.set(false);
    this.results.set([]);
    this.citySelected.emit(city);
  }

  onUseLocation(): void {
    this.isOpen.set(false);
    this.useLocation.emit();
  }

  onBlur(): void {
    // Delay so click events on results still register before closing.
    setTimeout(() => this.isOpen.set(false), 150);
  }
}
