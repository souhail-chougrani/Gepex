import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CriteriaSearchComponent } from './criteria-search/criteria-search.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListDossiersComponent } from './list-dossiers/list-dossiers.component';
import {
  ButtonsActionsComponent,
  SendToAgtModalComponent
} from './buttons-actions/buttons-actions.component';
import { NgbModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
// Content Loader
import { ContentLoaderModule } from '@netbasal/content-loader';
import { ClosePopoverOnClickOutsideDirective } from './directives/close-popover-on-click-outside.directive';
import {
  ListFiltresComponent,
  SaveFilterModalComponent
} from './list-filtres/list-filtres.component';
import { NgxGalleryModule } from 'ngx-gallery';
// button primeNg
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { GrowlModule } from 'primeng/growl';
import { PickListModule } from 'primeng/picklist';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SpinnerModule } from 'primeng/spinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChartsModule } from 'ng2-charts';
import { NoCommaPipe } from './pipes/no-comma.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { CdkTableModule } from '@angular/cdk/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { MatSortModule } from '@angular/material';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { NgProgressModule } from '@ngx-progressbar/core';
import { SearchComponent } from './search/search.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ExportModalComponent } from './list-dossiers/dialogs/export.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Criteria PrimeNg
    MultiSelectModule,
    DialogModule,
    CalendarModule,
    NgSelectModule,
    ContentLoaderModule,

    CheckboxModule,
    NgbModule.forRoot(),
    ToggleButtonModule,
    DropdownModule,
    CdkTableModule,
    MatSortModule,
    OverlayPanelModule,
    ModalDialogModule.forRoot(),
    AutoCompleteModule
  ],
  declarations: [
    CriteriaSearchComponent,
    ListDossiersComponent,
    ButtonsActionsComponent,
    ClosePopoverOnClickOutsideDirective,
    ListFiltresComponent,
    ClickOutsideDirective,
    SendToAgtModalComponent,
    SaveFilterModalComponent,
    SearchComponent,
    ExportModalComponent,

    // Pipes
    NoCommaPipe,
    SafeHtmlPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ListFiltresComponent,
    // CriteriaSearch
    CriteriaSearchComponent,
    // list dossiers
    ListDossiersComponent,
    // Liste buttons
    ButtonsActionsComponent,
    PaginatorModule,
    DialogModule,
    CalendarModule,
    NgbTabsetModule,
    NgxGalleryModule,
    ButtonModule,
    CheckboxModule,
    ClickOutsideDirective,
    NgSelectModule,
    GrowlModule,
    PickListModule,
    ToggleButtonModule,
    NgbModule,
    SpinnerModule,
    RadioButtonModule,
    ChartsModule,
    AccordionModule,
    NoCommaPipe,
    CdkTableModule,
    MatSortModule,
    ModalDialogModule,
    MultiSelectModule,
    NgProgressModule,
    SearchComponent
  ],
  entryComponents: [
    SendToAgtModalComponent,
    SaveFilterModalComponent,
    ExportModalComponent
  ]
})
export class SharedModule {}
