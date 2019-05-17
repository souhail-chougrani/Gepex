import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DossierDetailsComponent } from './dossier-details/dossier-details.component';

const routes: Routes = [
  {
    path: 'detail/:id',
    component: DossierDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierDetailsRoutingModule {}
