import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocieteComponent } from './societe/societe.component';
import { SocieteHomeComponent } from './societe-home/societe-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'missions/home', pathMatch: 'full' },
  {
    path: 'missions/home',
    component: SocieteHomeComponent
  },
  {
    path: 'missions/:status',
    component: SocieteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocieteRoutingModule {}
