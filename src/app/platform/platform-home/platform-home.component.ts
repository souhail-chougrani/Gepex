import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-platform-home',
  templateUrl: './platform-home.component.html',
  styleUrls: ['./platform-home.component.css']
})
export class PlatformHomeComponent implements OnInit {
  criter: any;
  listCards: Array<any>;

  public polarAreaChartLabels: string[] = [
    'RMA',
    'SAHAM',
    'ATLANTA',
    'SANAD',
    'AXA',
    'WAFFA ASSURANCE'
  ];
  public polarAreaChartData: number[] = [300, 500, 100, 150, 120, 410];
  public polarAreaLegend = true;

  public polarAreaChartType = 'polarArea';
  constructor() {}

  ngOnInit() {
    this.listCards = [
      {
        icon: 'fa fa-clipboard',
        classColor: 'bck-dark-blue',
        title: 'RMA titre 1',
        count: 15,
        titlelink: 'Liste RMA titre 1',
        routerlink: '#'
      },
      {
        icon: 'fa fa-file-text',
        classColor: 'bck-light-blue',
        title: 'RMA titre 2',
        count: 188,
        titlelink: 'Liste RMA titre 2',
        routerlink: '#'
      },
      {
        icon: 'fa fa-product-hunt',
        classColor: 'bck-light-pink',
        title: 'RMA titre 3',
        count: 159,
        titlelink: 'Liste RMA titre 3',
        routerlink: '#'
      }
    ];
  }

  // events
  public chartClicked(e: any): void {}

  public chartHovered(e: any): void {}
}
