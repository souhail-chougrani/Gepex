export class Global {
  id: string;
  name: string;
}
export class Ville {
  Id: number;
  Libelle: string;
}
export class AllImages {
  OmImage: any;
  Designation2Expert: any;
}
export class Marque {
  id: number;
  libelle: string;
  constructor(data: Marque) {
    this.id = data.id;
    this.libelle = data.libelle;
  }
}
export class CotationsMission {
  CotationEnteteID: string;
  Fonction: string;
  NbrPieces: number;
  TotalTTC: number;
  DateDemande: string;
  Status: string;
}
export class Guarantie {
  CodeTypeGarantie: string;
  Libelle: string;
}
export class TypeMission {
  CodeTypeMission: string;
  Libelle: string;
}

export class MainOeuvre {
  typeMOeuvre: string;
  codeSociete: string;
  numPiece: string;
  tmottc: number;
  tmoht: number;
  tmotva: number;
}
export class Pec {
  StatusPEC: string;
  NPEC: string;
  DatePEC: Date;
  EtatPEC: string;
}
export class PrixByArticle {
  ID: string;
  prixGepex: string;
  // prixExpert: number
  prixGarage: string;
  constructor(id: string, prixGepex: string, prixGarage: string) {
    this.ID = id;
    this.prixGepex = prixGepex;
    this.prixGarage = prixGarage;
    // this.prixGarage=this.prixGarage
  }
}
export class Data {
  name: string;
  series: Serie[];
}
export class Serie {
  name: string;
  value: number;
}

export class FilterOpt {
  id: number;
  name: string;
}
