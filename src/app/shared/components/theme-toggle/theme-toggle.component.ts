import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
  i18n = inject(I18nService);

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleLang(): void {
    this.i18n.toggleLang();
  }
}
