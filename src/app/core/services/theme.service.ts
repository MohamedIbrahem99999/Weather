import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'weather-app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Current active theme, exposed as a signal so components can react to it. */
  readonly theme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    // Whenever the theme signal changes, persist it and reflect it on <html>.
    effect(() => {
      const mode = this.theme();
      document.documentElement.setAttribute('data-theme', mode);
      localStorage.setItem(STORAGE_KEY, mode);
    });
  }

  toggle(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  private getInitialTheme(): ThemeMode {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'dark'; // App defaults to the designed dark/purple theme
  }
}
