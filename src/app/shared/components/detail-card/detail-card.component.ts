import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-card',
  standalone: true,
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.css',
})
export class DetailCardComponent {
  @Input({ required: true }) icon = '';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() hint = '';
}
