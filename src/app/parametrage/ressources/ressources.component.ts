import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Marque, Ressource } from './ressource';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {
  api = environment.api;
  marques: Marque[];
  experts: Ressource[];
  fournisseurs: Ressource[];
  compagnies: Ressource[];
  garages: Ressource[];
  villes: Ressource[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<Marque[]>(this.api + '/GEPEX-API/global/Marques')
      .subscribe(res => {
        this.marques = res;
      });
    this.http
      .get<Ressource[]>(this.api + '/GEPEX-API/global/Experts')
      .subscribe(res => {
        this.experts = res;
      });
    this.http
      .get<Ressource[]>(this.api + '/GEPEX-API/global/Fournisseurs')
      .subscribe(res => {
        this.fournisseurs = res;
      });
    this.http
      .get<Ressource[]>(this.api + '/GEPEX-API/global/Compagnies')
      .subscribe(res => {
        this.compagnies = res;
      });
    this.http
      .get<Ressource[]>(this.api + '/GEPEX-API/global/Garages')
      .subscribe(res => {
        this.garages = res;
      });

    this.http
      .get<Ressource[]>(this.api + '/GEPEX-API/global/Garages')
      .subscribe(res => {
        this.villes = res;
      });
  }
}
