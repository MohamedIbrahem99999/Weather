import { Component, Input, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-sun-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './sun-card.component.html',
  styleUrl: './sun-card.component.css',
})
export class SunCardComponent {
  private _sunrise = signal(0);
  private _sunset = signal(0);
  private _tz = signal(0);
  private _now = signal(Math.floor(Date.now() / 1000));

  @Input({ required: true }) set sunrise(v: number) {
    this._sunrise.set(v);
  }
  @Input({ required: true }) set sunset(v: number) {
    this._sunset.set(v);
  }
  @Input() set timezoneOffset(v: number) {
    this._tz.set(v);
  }

  sunriseLabel = computed(() => this.formatTime(this._sunrise()));
  sunsetLabel = computed(() => this.formatTime(this._sunset()));

  /** 0 = sunrise, 1 = sunset, used to position the sun marker along the arc. */
  progress = computed(() => {
    const start = this._sunrise();
    const end = this._sunset();
    const now = this._now();
    if (end <= start) return 0;
    return Math.min(1, Math.max(0, (now - start) / (end - start)));
  });

  markerPoint = computed(() => {
    const t = this.progress();
    const x = 10 + t * 100; // arc spans x=10..110
    // simple parabola for the arc height (peaks at t=0.5)
    const y = 55 - Math.sin(t * Math.PI) * 35;
    return { x, y };
  });

  private formatTime(unixSeconds: number): string {
    const localMs = (unixSeconds + this._tz()) * 1000;
    return new Date(localMs).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
