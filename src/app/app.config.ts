import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { I18nService } from './core/i18n/i18n.service';
import { ThemeService } from './core/services/theme.service';

function initI18n(i18n: I18nService) {
  return () => i18n.init();
}

function initTheme(theme: ThemeService) {
  // Reading the signal once forces the constructor effect to apply data-theme on boot.
  return () => Promise.resolve(theme.theme());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initI18n,
      deps: [I18nService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initTheme,
      deps: [ThemeService],
      multi: true,
    },
  ],
};
