import { Component, Input } from '@angular/core';
import { Historique } from '../../core/models/Historique';
import { DossierDetailsService } from '../../core/apiServices/dossier-details.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {
  missionHistory: Historique[] = [];
  @Input()
  selectedMissionId: number;
  histoDisplay = false;

  constructor(private dossierDetailsSvc: DossierDetailsService) {
    moment.locale('fr');
  }

  getHistory() {
    if (this.missionHistory.length === 0) {
      this.dossierDetailsSvc
        .getHistoriqueMission(this.selectedMissionId)
        .pipe(
          //Was used To add hour to gepex historique
          // tap(t =>
          //   t.map(e => {
          //     if (e.Platform === 'Gepex') {
          //       const m = moment(e.DateEnvoi + 'Z');
          //       e.DateEnvoi = m.tz('Africa/Casablanca');
          //     }
          //     return e;
          //   })
          // )
        )
        .subscribe(e => (this.missionHistory = e));
    }
  }
}
