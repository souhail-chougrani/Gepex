export class PrixArticle {
  CotationLigneID: string;
  CotationEnteteID: string;
  QteDemande: number;
  TypeArticle: string;
  PrixHT: string;
  PrixGepex: {
    Fonction?: string;
    PrixHT?: number;
    TypeArticle?: string;
    QteDemande?: number;
    MontantHT?: number;
  }[];
  MontantHT: string;
  TVA: string;
  MontantTTC: string;
}

export class PrixGepexBoolean {
  ModifPrix: number;
  TypeArticle: string;
  PrixHTExpert: boolean;
  PrixHTGarage: boolean;
  PrixHTAGT: boolean;
  PrixHTGEPEX: boolean;
}
export class PrixStatistique {
  Designation: string;
  Prix: {
    REC: any[];
    ORG: any[];
    ADP: any[];
  };
}

export class PRIXGEPEX {
  PrixHTExpert: number;
  PrixHTGarage: number;
  PrixHTAGT: number;
  PrixHTGEPEX: number;
  typeExpert: string;
  typeGarage: string;
}
