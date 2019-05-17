import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginGuardGuard } from './core/services/login-guard.service';
import { environment } from 'src/environments/environment';
import { RoleGuardService } from './core/services/role-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'platform',
    loadChildren: './platform/platform.module#PlatformModule',
    data: {
      compagnieID: 0,
      roles: ['operateur', 'administrateur']
    },
    canLoad: [RoleGuardService],
    canActivateChild: [RoleGuardService]
  },
  {
    path: 'parametrage',
    loadChildren: './parametrage/parametrage.module#ParametrageModule',
    data: {
      compagnieID: -1,
      roles: ['administrateur']
    },
    canLoad: [RoleGuardService],
    canActivateChild: [RoleGuardService]
  },
  {
    path: 'societe',
    loadChildren: './societe/societe.module#SocieteModule',
    data: {
      compagnieID: 1,
      roles: ['operateur', 'administrateur']
    },
    canLoad: [RoleGuardService],
    canActivateChild: [RoleGuardService]
  },
  {
    path: 'missions',
    loadChildren:
      './dossier-details/dossier-details.module#DossierDetailsModule',
    data: {
      compagnieID: -1,
      roles: ['operateur', 'administrateur']
    },
    canLoad: [RoleGuardService],
    canActivateChild: [RoleGuardService]
  },

  {
    path: 'login',
    loadChildren: './auth/auth.module#AuthModule',
    canActivate: [LoginGuardGuard]
  },
  {
    path: '403',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preload all modules; optionally we could
      // implement a custom preloading strategy for just some
      // of the modules
      useHash: environment.useHash
      // enableTracing: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
