import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { DossiersService } from 'src/app/core/apiServices/dossiers.service';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  tap,
  switchMap,
  catchError,
  map,
  filter
} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  value: string;
  results: string[] = [];
  gotFocus: boolean;
  @ViewChild('overlay')
  overlay: OverlayPanel;
  @ViewChild('target')
  target: ElementRef<any>;
  searching: boolean;
  searchFailed: boolean;
  error: string;
  type : string = 'matricule';
  constructor(
    private dossierService: DossiersService,
    private router: Router
  ) {
    
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      tap(value => {
        this.results = [];
        if (!value) {
          this.overlay.hide();
        }
      }),
      filter(v => !!v),
      debounceTime(500),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.dossierService.searchMissions(term,this.type).pipe(
          tap(() => (this.searchFailed = false)),
          map(data => {
            this.results = data;
            this.showOverlay();
          }),
          catchError(err => {
            this.searchFailed = true;
            this.error = err.error.message || err.message;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    )

  handleFocus(event: MouseEvent) {
    if (this.gotFocus) {
      event.stopPropagation();
      return;
    }
    this.gotFocus = true;
    if (this.value) {
      this.showOverlay(event);
    }
  }

  handleBlur() {
    this.gotFocus = false;
    // this.overlay.hide();
  }

  showOverlay(e = event) {
    this.overlay.show(e, this.target.nativeElement);
  }

  navigate(id) {
    this.router.navigate(['missions', 'detail', id]);
  }
}
