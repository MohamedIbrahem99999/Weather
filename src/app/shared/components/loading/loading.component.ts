import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {}
