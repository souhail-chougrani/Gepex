import { Component, Input, OnInit } from '@angular/core';
import { Mission } from '../../core/models/Mission';

// @Component({
//   selector: 'app-impression',
//   templateUrl: './impression.component.html',
//   styleUrls: ['./impression.component.css']
// })
export class ImpressionComponent implements OnInit {
  @Input()
  mission: Mission;
  @Input()
  table: HTMLTableElement;
  @Input()
  fonction: string;
  phaseNumbers = ['I', 'II'];

  ngOnInit(): void {}

  print() {
    const popup = window.open(
      '',
      '_blank',
      'width=1024,height=768,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popup.document.open();
    popup.document.write(this.htmlToPrint(this.table, this.mission));
    popup.document.close();
  }

  getContent(phase: string, element: HTMLElement) {
    if (phase === this.phaseNumbers[0]) {
      element.classList.add('phase-two');
    }
    return `<table class="table info">
    <thead>
      <tr>
        <th class="text-center" scope="col" colspan="4">
          <h1>Etat de Synthèse Phase-${phase}</h1>
        </th>
      </tr>
    </thead>
    <tbody>
<tr>
  <td>
    Num Dossier :
  </td>
  <td>
    <b>
      ${this.mission.NumMission}
    </b>
  </td>
  <td>
    Véhicule :
  </td>
  <td>
    <b>
      ${this.mission.Marque} - ${this.mission.Model}
    </b>
  </td>
</tr>
<tr>
  <td>
    Matricule :
  </td>
  <td>
    <b>
      ${this.mission.Matricule}
    </b>
  </td>
  <td>
    N° Chassi :
  </td>
  <td>
    <b> 
      ${this.mission.NumChassi}
    </b>
  </td>
</tr>
<tr>
  <td>
    Année MEC :
  </td>
  <td>
    <b>
      ${new Date(this.mission.DateMEC).getFullYear()}
    </b>
  </td>
</tr>
</tbody>
  </table>
  ${element.outerHTML}`;
  }

  htmlToPrint(element: HTMLElement, mission: Mission) {
    return `
      <html><head>
      <link rel="stylesheet" href="../../assets/css/bootstrap.min.css">
      <style>
        .info {
          margin: 30px 0 40px;
        }
        .info h1 {
          margin-bottom: 20px;
        }
        .info thead th, .info td, .info th {
          border: none;
        }
        td {
            padding : 0.35rem !important;
            font-size : 0.85rem !important;
        }
        thead { display: table-row-group; }
        tfoot { display: table-row-group; }

        #content {
            display: table-row-group;
        }
        #logo {
            display: table-header-group;
        }
        #logo img {
            width: 40px;
        }

        #pageFooter {
            display: table-footer-group;
            width: 100%;
            font-weight: bold;
        }

        @media print {
            @page {
                size: landscape;
                -webkit-transform: rotate(90deg);
                -moz-transform: rotate(90deg);
                -o-transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                transform: rotate(90deg);
            }
        }
        .phase-two {
          display: none;
        }
      </style>
        </head><body onload="window.print();">
        <div class="d-flex flex-column">
        <div id="logo">
            <img src="../../assets/img/GepexLogin.png" />
        </div>
          <div id="content" style="flex: 1 1 100%;">
          <div class="container">
          ${this.phaseNumbers.forEach(p => this.getContent(p, element))}
      </div>
          </div>
          <div id="pageFooter" class"w-100">
          <p class="text-center">&copy;${new Date().getFullYear()} Expertis decision - Tous droits réservés.</p>
          </div>
        </div>
      </html>`;
  }
}
