import { Component, Input, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { uvLevelKey } from '../../../core/utils/weather-icon.util';

@Component({
  selector: 'app-uv-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './uv-card.component.html',
  styleUrl: './uv-card.component.css',
})
export class UvCardComponent {
  private _uv = signal<number | null>(null);

  @Input({ required: true }) set uv(value: number | null) {
    this._uv.set(value);
  }
  get uv(): number | null {
    return this._uv();
  }

  levelKey = computed(() => (this._uv() !== null ? uvLevelKey(this._uv()!) : ''));
  percent = computed(() => (this._uv() !== null ? Math.min(100, (this._uv()! / 11) * 100) : 0));
}
