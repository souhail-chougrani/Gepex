import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DossierDetailsComponent } from './dossier-details/dossier-details.component';
import { SharedModule } from '../shared/shared.module';
import { TableDevisComponent } from './table-devis/table-devis.component';
import { DossierDetailsRoutingModule } from './dossier-details-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HistoriqueComponent } from './historique/historique.component';
import { OffresModalComponent } from './table-devis/dialogs/offres.component';
import { ChangePricesModalComponent } from './table-devis/dialogs/change-prices.component';
import { EditMissionDialogComponent } from './sidebar/dialogs/edit-mission-dialog.component';
import { EditDesignationModalComponent } from './table-devis/dialogs/edit-designation.component';

@NgModule({
  imports: [CommonModule, SharedModule, DossierDetailsRoutingModule],
  declarations: [
    DossierDetailsComponent,
    TableDevisComponent,
    SidebarComponent,
    HistoriqueComponent,
    // ImpressionComponent,
    OffresModalComponent,
    ChangePricesModalComponent,
    EditMissionDialogComponent,
    EditDesignationModalComponent
  ],
  entryComponents: [
    ChangePricesModalComponent,
    OffresModalComponent,
    EditMissionDialogComponent,
    EditDesignationModalComponent
  ]
})
export class DossierDetailsModule {}
