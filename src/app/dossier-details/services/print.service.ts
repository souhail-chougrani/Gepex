import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  print(element: HTMLElement, mission: any) {
    const popup = window.open(
      '',
      '_blank',
      'width=1024,height=768,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popup.document.open();
    popup.document.write(this.htmlToPrint(element, mission));
    popup.document.close();
  }

  getContent(element: HTMLElement, mission: any) {
    const copy = <HTMLTableElement>element.cloneNode(true);
    return `<table class="table info">
    <thead>
      <tr>
        <th class="text-center" scope="col" colspan="4">
          <h1>Etat de Synthèse</h1>
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
      ${mission.NumMission}
    </b>
  </td>
  <td>
    Véhicule :
  </td>
  <td>
    <b>
      ${mission.Marque} - ${mission.Model}
    </b>
  </td>
</tr>
<tr>
  <td>
    Matricule :
  </td>
  <td>
    <b>
      ${mission.Matricule}
    </b>
  </td>
  <td>
    N° Chassi :
  </td>
  <td>
    <b>
      ${mission.NumChassi}
    </b>
  </td>
</tr>
<tr>
  <td>
    Année MEC :
  </td>
  <td>
    <b>
      ${new Date(mission.DateMEC).getFullYear()}
    </b>
  </td>
</tr>
</tbody>
  </table>
  ${copy.outerHTML}`;
  }

  htmlToPrint(element: HTMLElement, mission: any) {
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
        td, th {
            padding : 5px !important;
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
        }

        @media print {
            @page {
                size: landscape;
            }
        }
      </style>
        </head><body onload="window.print();">
        <div class="d-flex flex-column">
        <div id="logo">
            <img src="../../assets/img/GepexLogin.png" />
        </div>
          <div id="content">
          <div class="container">
          ${this.getContent(element, mission)}
      </div>
          </div>
          <div id="pageFooter">
          <p class="text-center">&copy;${new Date().getFullYear()} Expertis decision - Tous droits réservés.</p>
          </div>
        </div>
      </html>`;
  }
}
