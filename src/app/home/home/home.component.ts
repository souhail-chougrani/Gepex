import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  test:any;
  constructor() {}
  fct(){
    console.log("traitement!0");
  }
}
