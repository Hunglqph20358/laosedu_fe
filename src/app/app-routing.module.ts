// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
// Auth
import {AuthGuard} from './core/auth';
import {environment} from "../environments/environment";


const roleParam = environment.ROLE;
const ADMIN = roleParam.ADMIN;
const HP = roleParam.HP;
const HT = roleParam.HT;
const GV_CN = roleParam.GV_CN;
const GV_BM = roleParam.GV_BM;
const PH = roleParam.PH;
const TK = roleParam.TK;
const routes: Routes = [
  {path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},
  {path: 'error', loadChildren: () => import('./views/pages/error/error.module').then(m => m.ErrorModule)},
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'ngbootstrap',
        loadChildren: () => import('./views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
      },
      {
        path: 'material',
        loadChildren: () => import('./views/pages/material/material.module').then(m => m.MaterialModule),
      },
      {
        path: 'builder',
        loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule),
      },
      {
        path: 'system',
        loadChildren: () => import('./views/pages/system/system.module').then(m => m.SystemModule),
      },

      {path: '', redirectTo: '/system/school/configuration', pathMatch: 'full'},
      {path: '**', redirectTo: '/system/school/configuration', pathMatch: 'full'}

    ],
  },
  {path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
