import { CotationDetails } from './articles';
import { Mission } from './Mission';
import {
  AllImages,
  CotationsMission,
  Guarantie,
  TypeMission,
  MainOeuvre,
  Pec
} from './global';
import { DossierVIN } from './Vehicule';
import { Historique } from './Historique';

export interface IDetailDossier {
  Mission: Mission;
  cotations: CotationsMission[];
  articles: CotationDetails[];
  allImages: AllImages;
  PrixRef: string;
  Histo: Historique[];
}

export class DetailDossier implements IDetailDossier {
  Histo: any[];
  count: number;
  Mission: Mission;
  cotations: CotationsMission[]; // à enlever
  DossierDetail: DossierDetail;
  Documents: string[];
  DocumentsAV: string[];
  articles: CotationDetails[]; // juste pour implimenter l'interface
  articleAvecPrix: CotationDetails[];
  allImages: AllImages;
  PrixRef: string;
  DossierVIN: DossierVIN;
  cotationExpert?: CotationsMission;
  cotationGaragiste?: CotationsMission;
  cotationGepex?: CotationsMission;
  cotationAgt?: CotationsMission;

  constructor(private data: DetailDossier) {
    this.count = data.count;
    this.Mission = data.Mission;
    this.DossierDetail = data.DossierDetail;
    this.Documents = data.Documents;
    this.DocumentsAV = data.DocumentsAV;
    this.cotations = data.cotations;
    this.articles = data.articles;
    this.allImages = data.allImages;
    this.PrixRef = data.PrixRef;
    this.articleAvecPrix = data.articles.map(a => new CotationDetails(a));
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
export class Result<T> {
  articles: T[];
}

export class DossierDetail {
  TypeGarantie: Guarantie;
  TypeGarantie2: Guarantie;
  TypeGarantie3: Guarantie;
  TypeMission: TypeMission;
  Franchise: string;
  Plafond: string;
  Type_Mine: string;
  PriseEnCharge: string;
  FranchiseMin?: number;
  Responsabilite: string;
  NPolice: string;
  NPoliceAdv: string;
  ReferenceCie: string;
  DateAccident: string;
  NumPiece: string;
  CodeSociete: string;
  mOeuvres: MainOeuvre[];
  PEC: Pec;
}
