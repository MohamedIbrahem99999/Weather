import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // re-evaluate when the language signal changes
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(key: string, fallback?: string): string {
    // Reading the signal here keeps this pipe reactive to language switches.
    this.i18n.lang();
    return this.i18n.t(key, fallback);
  }
}
