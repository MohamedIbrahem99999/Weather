import { Component, Input, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CurrentWeather } from '../../../core/models/weather.model';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { I18nService } from '../../../core/i18n/i18n.service';
import { dewPoint } from '../../../core/utils/weather-icon.util';
import { DetailCardComponent } from '../detail-card/detail-card.component';
import { WindCompassComponent } from '../wind-compass/wind-compass.component';
import { UvCardComponent } from '../uv-card/uv-card.component';
import { SunCardComponent } from '../sun-card/sun-card.component';
import { AirQualityCardComponent } from '../air-quality-card/air-quality-card.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-details-grid',
  standalone: true,
  imports: [
    TranslatePipe,
    DecimalPipe,
    DetailCardComponent,
    WindCompassComponent,
    UvCardComponent,
    SunCardComponent,
    AirQualityCardComponent,
  ],
  templateUrl: './details-grid.component.html',
  styleUrl: './details-grid.component.css',
})
export class DetailsGridComponent {
  private i18n = inject(I18nService);

  private _current = signal<CurrentWeather | null>(null);
  @Input({ required: true }) set current(value: CurrentWeather) {
    this._current.set(value);
  }
  @Input() uvIndex: number | null = null;
  @Input() aqi: number | null = null;

  dew = computed(() => {
    const c = this._current();
    return c ? dewPoint(c.temp, c.humidity) : 0;
  });

  get current(): CurrentWeather | null {
    return this._current();
  }

  humidityHint(): string {
    this.i18n.lang(); // keep this method reactive to language switches
    return this.i18n.t('details.humidityHint').replace('{value}', String(this.dew()));
  }
}
