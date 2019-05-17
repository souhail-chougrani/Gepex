import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ComptesComponent } from './comptes/comptes.component';
import { RessourcesComponent } from './ressources/ressources.component';
import { UserDialogComponent } from './comptes/user-dialog/user-dialog.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    SharedModule,
    OverlayPanelModule
  ],
  declarations: [ComptesComponent, RessourcesComponent, UserDialogComponent],
  entryComponents: [UserDialogComponent]
})
export class ParametrageModule {}
