import { Component, Input, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { aqiLevelKey } from '../../../core/utils/weather-icon.util';

@Component({
  selector: 'app-air-quality-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './air-quality-card.component.html',
  styleUrl: './air-quality-card.component.css',
})
export class AirQualityCardComponent {
  private _aqi = signal<number | null>(null);
  @Input({ required: true }) set aqi(v: number | null) {
    this._aqi.set(v);
  }
  get aqi(): number | null {
    return this._aqi();
  }

  levelKey = computed(() => (this._aqi() !== null ? aqiLevelKey(this._aqi()!) : ''));
  percent = computed(() => (this._aqi() !== null ? (this._aqi()! / 5) * 100 : 0));
}
