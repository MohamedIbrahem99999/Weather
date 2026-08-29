import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HourlyForecastItem } from '../../../core/models/weather.model';
import { weatherEmoji } from '../../../core/utils/weather-icon.util';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './hourly-forecast.component.html',
  styleUrl: './hourly-forecast.component.css',
})
export class HourlyForecastComponent {
  @Input({ required: true }) items: HourlyForecastItem[] = [];
  @Input() timezoneOffset = 0;

  emoji = weatherEmoji;

  hourLabel(dt: number, index: number): string {
    if (index === 0) {
      return '';
    }
    const localMs = (dt + this.timezoneOffset) * 1000;
    return new Date(localMs).toLocaleTimeString(undefined, {
      hour: 'numeric',
      hour12: true,
    });
  }
}
