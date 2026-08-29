import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DailyForecastItem } from '../../../core/models/weather.model';
import { weatherEmoji } from '../../../core/utils/weather-icon.util';

@Component({
  selector: 'app-weekly-forecast',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './weekly-forecast.component.html',
  styleUrl: './weekly-forecast.component.css',
})
export class WeeklyForecastComponent {
  @Input({ required: true }) items: DailyForecastItem[] = [];

  emoji = weatherEmoji;
}
