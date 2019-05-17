import { CriteriasService } from './../../core/utils-services/criterias.service';
import { SearchInput, SavedFilter } from '../../core/models/SearchInput';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  ViewContainerRef,
  ComponentRef,
  OnDestroy
} from '@angular/core';
import { StatusParamService } from '../../core/utils-services/status-param.service';
import {
  ModalDialogService,
  IModalDialog,
  IModalDialogOptions
} from 'ngx-modal-dialog';
import { takeUntil, share, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DossiersService } from 'src/app/core/apiServices/dossiers.service';
import { FiltresService } from 'src/app/core/utils-services/filtres.service';

@Component({
  selector: 'app-list-filtres',
  templateUrl: './list-filtres.component.html',
  styleUrls: ['./list-filtres.component.css']
})
export class ListFiltresComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  hasFilters: boolean;
  savedFilters: SavedFilter[];
  criteria: SearchInput;
  selectedSavedFilter: any;

  constructor(
    private modalDialogService: ModalDialogService,
    private statusParam: StatusParamService,
    private criteriaSvc: CriteriasService,
    private viewRef: ViewContainerRef,
    private dossierService: DossiersService,
    private filtersService: FiltresService
  ) {}

  ngOnInit() {
    // this.statusParam.statusUrlSubject.subscribe(e => {
    //   this.status = e;
    //   this.filterInput = this.filtreSer.getCurrentFiltre();
    // });
    this.statusParam
      .getCurrentStatusUrlSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(status => {
        this.selectedSavedFilter = (this.savedFilters || []).find(
          f => f.id === this.filtersService.getCurrentFilterId()
        );
        this.criteriaSvc
          .currentSubject()
          .pipe(share())
          .subscribe(criteria => {
            this.criteria = criteria;
            this.hasFilters = this.criteriaSvc.hasFilters();
            if (!this.hasFilters && this.selectedSavedFilter) {
              this.selectedSavedFilter = null;
            }
          });
      });
    this.getSavedFilters();
  }

  getSavedFilters() {
    this.dossierService
      .getSavedFilters()
      .subscribe(filters => (this.savedFilters = filters));
  }

  onClear() {
    this.filtersService.clearCurrentFilter();
    this.criteriaSvc.initializeNext();
  }

  onChanged(event: SavedFilter) {
    if (!event) {
      return;
    }
    this.filtersService.setCurrentFilterId(event.id);
    this.criteriaSvc.setCurrentCriteria({
      ...this.criteriaSvc.getCurrentCriteria(),
      ...JSON.parse(event.recherche)
    });
  }

  saveCurrentFilter(title: string) {
    this.dossierService.saveFilter(title, this.criteria).subscribe(id => {
      this.criteria.RechercheID = id;
      this.getSavedFilters();
    });
  }

  deleteFilter(id) {
    this.dossierService.deleteSavedFilter(id).subscribe(() => {
      this.savedFilters = this.savedFilters.filter(f => f.id !== id);
      this.onClear();
    });
  }

  openSaveFilterDialog() {
    const onSave = new EventEmitter<string>();
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Enregistrement',
      childComponent: SaveFilterModalComponent,
      data: {
        onSave: onSave
      },
      settings: {
        notifyWithAlert: false
      }
    });
    onSave.pipe(take(1)).subscribe(title => this.saveCurrentFilter(title));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      <div class="form-row">
        <div class="col-md-12">
          <label for="title">Entrer le titre de filtre</label>
          <input
            id="title"
            type="text"
            class="form-control"
            formControlName="title"
            placeholder="titre de filtre"
            [ngClass]="{
              'is-invalid': title.errors && (title.dirty || title.touched)
            }"
          />
          <div class="invalid-feedback" *ngIf="title.errors?.required">
            Le champ Titre est obligatoire.
          </div>
          <div class="invalid-feedback" *ngIf="title.errors?.minlength">
            Le champ Titre doît avoir au moins 3 caractères.
          </div>
        </div>
      </div>
    </form>
  `
})
export class SaveFilterModalComponent implements IModalDialog {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get title() {
    return this.form.controls.title;
  }

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    options.actionButtons = [
      {
        buttonClass: 'btnAct',
        text: 'ANNULER',
        onAction: () => true
      },
      {
        buttonClass: 'btnAct',
        text: 'ENREGISTER',
        onAction: () => {
          this.title.markAsTouched();
          if (this.title.invalid) {
            return;
          }
          options.data.onSave.emit(this.title.value);
          return true;
        }
      }
    ];
  }
}
