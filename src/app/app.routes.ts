import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'saved',
    loadComponent: () =>
      import('./features/saved-cities/saved-cities.component').then(
        (m) => m.SavedCitiesComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
