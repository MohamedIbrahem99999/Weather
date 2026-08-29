import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  @Output() locate = new EventEmitter<void>();
}
