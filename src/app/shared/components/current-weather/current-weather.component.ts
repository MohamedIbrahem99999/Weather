import { Component, Input } from '@angular/core';
import { CurrentWeather } from '../../../core/models/weather.model';
import { weatherEmoji } from '../../../core/utils/weather-icon.util';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css',
})
export class CurrentWeatherComponent {
  @Input({ required: true }) data!: CurrentWeather;

  get emoji(): string {
    return weatherEmoji(this.data.icon);
  }
}
