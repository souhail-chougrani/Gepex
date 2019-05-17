import { SortDirection } from '@angular/material';

export class SearchInput {
  type?: string;
  CompagnieID?: string[];
  CompagnieAdvID?: string[];
  MontantDommageMin?: number;
  MontantDommageMax?: number;
  ExpertID?: string;
  GarageID?: string;
  AgentID?: string;
  CourtierID?: string;
  Matricule?: string;
  VilleExpertiseID?: number;
  VilleAccidentID?: number;
  NumChassi?: string;
  ModelID?: number;
  MarqueID?: number;
  DateDebut?: Date;
  DateFin?: Date;
  Garanties?: string[];
  TypeMissionID?: number[];
  devisExpert?: string;
  NPoliceAssurance: string;
  NPoliceAssuranceAdv: string;
  referenceCie: string;
  NumMission?: string;
  orderBy?: OrderBy;

  userName?: string;
  RechercheID?: number;
  CotationEnteteID?: string;
  public constructor(type: string) {
    this.type = type;
    this.orderBy = {
      column: 'DateOperation',
      direction: 'desc'
    };
  }
}

export class OrderBy {
  direction: SortDirection;
  column: string;
}

export interface SavedFilter {
  id: number;
  title: string;
  recherche: string;
}
