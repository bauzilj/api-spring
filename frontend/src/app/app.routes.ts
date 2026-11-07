import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tickets' },
  { path: 'tickets', loadComponent: () => import('./pages/tickets/tickets.page').then(m => m.TicketsPage) },
  { path: 'chamados', loadComponent: () => import('./pages/chamados/chamados.page').then(m => m.ChamadosPage) },
  { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.page').then(m => m.UsuariosPage) },
  { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias.page').then(m => m.CategoriasPage) },
  { path: '**', redirectTo: 'tickets' },
];
