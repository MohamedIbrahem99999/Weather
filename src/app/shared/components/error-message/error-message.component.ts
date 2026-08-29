import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent {
  @Input({ required: true }) messageKey = 'error.generic';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
