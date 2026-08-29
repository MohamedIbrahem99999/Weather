import { Injectable, signal } from '@angular/core';
import { SavedCity } from '../models/weather.model';

const STORAGE_KEY = 'weather-app-saved-cities';

@Injectable({ providedIn: 'root' })
export class SavedCitiesService {
  readonly cities = signal<SavedCity[]>(this.load());

  add(city: SavedCity): void {
    if (this.cities().some((c) => c.id === city.id)) {
      return;
    }
    const next = [...this.cities(), city];
    this.cities.set(next);
    this.persist(next);
  }

  remove(id: string): void {
    const next = this.cities().filter((c) => c.id !== id);
    this.cities.set(next);
    this.persist(next);
  }

  isSaved(id: string): boolean {
    return this.cities().some((c) => c.id === id);
  }

  private load(): SavedCity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedCity[]) : [];
    } catch {
      return [];
    }
  }

  private persist(cities: SavedCity[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }
}
