import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type Lang = 'en' | 'ar';

const STORAGE_KEY = 'weather-app-lang';
const RTL_LANGS: Lang[] = ['ar'];

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.getInitialLang());
  readonly dir = computed<'rtl' | 'ltr'>(() =>
    RTL_LANGS.includes(this.lang()) ? 'rtl' : 'ltr'
  );

  private translations: Record<string, string> = {};
  private cache: Partial<Record<Lang, Record<string, string>>> = {};

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    await this.load(this.lang());
    this.applyDocumentAttrs();
  }

  async setLang(lang: Lang): Promise<void> {
    if (lang === this.lang() && this.translations) {
      return;
    }
    await this.load(lang);
    this.lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyDocumentAttrs();
  }

  toggleLang(): void {
    this.setLang(this.lang() === 'en' ? 'ar' : 'en');
  }

  /** Simple key lookup, e.g. t('home.search') */
  t(key: string, fallback?: string): string {
    return this.translations[key] ?? fallback ?? key;
  }

  private async load(lang: Lang): Promise<void> {
    if (this.cache[lang]) {
      this.translations = this.cache[lang]!;
      return;
    }
    const data = await firstValueFrom(
      this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`)
    );
    this.cache[lang] = data;
    this.translations = data;
  }

  private applyDocumentAttrs(): void {
    document.documentElement.setAttribute('lang', this.lang());
    document.documentElement.setAttribute('dir', this.dir());
  }

  private getInitialLang(): Lang {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'ar') {
      return saved;
    }
    const browserLang = navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
    return browserLang;
  }
}
