import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/statistics/statistics.module').then(m => m.StatisticsModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
