import { CotationsMission } from './global';

export class Cotations {
  cotations: CotationsMission[];

  cotationExpert?: CotationsMission;
  cotationGaragiste?: CotationsMission;
  cotationGepex?: CotationsMission;
  cotationAgt?: CotationsMission;
  constructor(data: CotationsMission[]) {
    this.cotations = data;
    this.SetUp();
  }
  private SetUp(): void {
    const cotationGepex = this.cotations.filter(c => c.Fonction === 'GEPEX');
    this.cotationGepex = cotationGepex.length !== 0 ? cotationGepex[0] : null;

    const cotationsExpert = this.cotations.filter(c => c.Fonction === 'EXPERT');
    this.cotationExpert =
      cotationsExpert.length !== 0 ? cotationsExpert[0] : null;

    const cotationsGarage = this.cotations.filter(
      c => c.Fonction === 'GARAGISTE'
    );
    this.cotationGaragiste =
      cotationsGarage.length !== 0 ? cotationsGarage[0] : null;

    const cotationAgt = this.cotations.filter(c => c.Fonction === 'AGT');
    this.cotationAgt = cotationAgt.length !== 0 ? cotationAgt[0] : null;
  }
}
export interface Cotation {
  CotationEnteteID?: string;
  DateDemande?: string;
  Fonction?;
  MainOeuvre?;
  TotalTTC?;
  Details?: CotationDetail[] | any[];
}

export interface CotationDetail {
  CotationLigneID?;
  Designation?: string;
  GraphePrix?: string;
  ID?: string;
  MontantHT?: string;
  MontantTTC?: string;
  PrixGEPEX?: string;
  PrixHT?: string;
  PrixOrg?: string;
  PrixRef?: string;
  QteDemande?: string;
  TVA?: string;
  TypeArticle?: string;
  imagesCount?: string;
  EnvoyeAGT?: boolean;
}
