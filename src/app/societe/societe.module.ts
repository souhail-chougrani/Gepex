import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocieteRoutingModule } from './societe-routing.module';
import { SocieteComponent } from './societe/societe.component';
import { SharedModule } from '../shared/shared.module';
import { SocieteHomeComponent } from './societe-home/societe-home.component';

@NgModule({
  imports: [
    CommonModule,
    SocieteRoutingModule,
    SharedModule
  ],
  declarations: [SocieteComponent, SocieteHomeComponent]
})
export class SocieteModule { }
