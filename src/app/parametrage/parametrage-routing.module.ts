import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComptesComponent } from './comptes/comptes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users'
  },
  {
    path: 'users',
    component: ComptesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule {}
