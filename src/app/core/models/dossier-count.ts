export class DossierCount {
  EnCours: number;
  SelectionnesParCompagnie: number;
  EnvoyesAGT: number;
  TraitesAGT: number;
  EnCoursDeTraitement: number;
  Traites: number;
  NonTraites: number;
  Annules: number;
  DTD: number;
  PEC: number;
  ArchiveTotal: number;
  ArchiveEnCours: number;
  ArchiveEnAttente: number;
  ArchiveTraites: number;
  FrontOffice: number;
  Reforme: number;
  Non_Traitable: number;
  DPEC: number;
  ATTPEC: number;
  ATTVPEC: number;
  REJPEC: number;
  Ecom: number;
  RMA:number
  constructor({
    EnCours = 0,
    SelectionnesParCompagnie = 0,
    EnvoyesAGT = 0,
    TraitesAGT = 0,
    EnCoursDeTraitement = 0,
    Traites = 0,
    NonTraites = 0,
    Annules = 0,
    DTD = 0,
    PEC = 0,
    ArchiveTotal = 0,
    ArchiveEnCours = 0,
    ArchiveEnAttente = 0,
    ArchiveEnTraites = 0,
    FrontOffice = 0,
    Reforme = 0,
    Non_Traitable = 0,
    DPEC = 0,
    ATTPEC = 0,
    ATTVPEC = 0,
    REJPEC = 0,
    Ecom = 0,
    RMA=0

  }) {
    this.EnCours = EnCours;
    this.SelectionnesParCompagnie = SelectionnesParCompagnie;
    this.EnvoyesAGT = EnvoyesAGT;
    this.TraitesAGT = TraitesAGT;
    this.EnCoursDeTraitement = EnCoursDeTraitement;
    this.Traites = Traites;
    this.NonTraites = NonTraites;
    this.Annules = Annules;
    this.DTD = DTD;
    this.PEC = PEC;
    this.ArchiveTotal = ArchiveTotal;
    this.ArchiveEnAttente = ArchiveEnAttente;
    this.ArchiveEnCours = ArchiveEnCours;
    this.ArchiveTraites = ArchiveEnTraites;
    this.FrontOffice = FrontOffice;
    this.Reforme = Reforme;
    this.Non_Traitable = Non_Traitable;
    this.DPEC = DPEC;
    this.ATTPEC = ATTPEC;
    this.ATTVPEC = ATTVPEC;
    this.REJPEC = REJPEC;
    this.Ecom = Ecom;
    this.RMA=RMA
  }
}

export function editDossier(
  d: DossierCount,
  type: string,
  newValue: number
): DossierCount {
  switch (type.toLowerCase()) {
    /**
     * Fonctions envoie
     */

    // Restore
    case 'nontraites|en cours':
      d.NonTraites -= newValue;
      // d.EnCours += newValue;
      break;
    case 'dtd|en cours':
      d.DTD -= newValue;
      // d.EnCours += newValue;
      break;
    case 'pec|en cours':
      d.PEC -= newValue;
      // d.EnCours += newValue;
      break;

    // Archive
    case 'en cours|archive-en cours':
      d.EnCours -= newValue;
      // d.ArchiveEnCours += newValue;
      break;
    case 'selectionnesparcompagnie|archive-selectionnesparcompagnie':
      d.EnCours -= newValue;
      // d.ArchiveEnAttente += newValue;
      break;
    case 'traites|archive-traites':
      d.EnCours -= newValue;
      // d.ArchiveTraites += newValue;
      break;

    // Send To Agent
    case 'en cours|envoyesagt':
      d.EnCours -= newValue;
      // d.EnvoyesAGT += newValue;
      break;
    case 'selectionnesparcompagnie|envoyesagt':
      d.SelectionnesParCompagnie -= newValue;
      // d.EnvoyesAGT += newValue;
      break;
    case 'frontoffice|envoyesagt':
      d.FrontOffice -= newValue;
      // d.EnvoyesAGT += newValue;
      break;

    // Send To Front Office
    case 'en cours|frontoffice':
      d.EnCours -= newValue;
      // d.FrontOffice += newValue;
      break;

    // Send To Platform
    case 'en cours|selectionnesparcompagnie':
      d.EnCours -= newValue;
      // d.SelectionnesParCompagnie += newValue;
      break;

    // Send To Socity
    case 'traitesagt|traites':
      d.TraitesAGT -= newValue;
      // d.Traites += newValue;
      break;
  }
  return d;
}
