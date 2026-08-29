import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-wind-compass',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './wind-compass.component.html',
  styleUrl: './wind-compass.component.css',
})
export class WindCompassComponent {
  @Input({ required: true }) speed = 0;
  @Input({ required: true }) deg = 0;
}
