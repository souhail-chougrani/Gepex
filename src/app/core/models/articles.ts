import { PrixArticle, PRIXGEPEX } from './prix';

export class CotationDetails {
  ID: string;
  Designation: string;
  LesPrixDArticle: PrixArticle[];
  PrixGEPEX: PRIXGEPEX;
  imagesCount: number;
  PrixRef: string;
  constructor(data: CotationDetails) {
    this.ID = data.ID;
    this.Designation = data.Designation;
    this.LesPrixDArticle = data.LesPrixDArticle;
    this.PrixGEPEX = data.PrixGEPEX;
    this.imagesCount = data.imagesCount;
    this.PrixRef = data.PrixRef;
  }

  public GetPrixArticleDeCotation(cotationId: string): PrixArticle {
    const prix = this.LesPrixDArticle.filter(c => c != null).filter(
      c => c.CotationEnteteID === cotationId
    );
    return prix.length !== 0 ? prix[0] : new PrixArticle();
  }
}
