import { CotationDetails } from './articles';

export class UserInfo {
  public Login?: string;
  public Nom?: string;
  public Prenom?: string;
  public TelephoneAGT?: string;
  public UserType?: string;
  public VilleAGT?: string;
  public CompagnieID?: string;
  public GarageID?: string;
  public RsCompagnie?: string;
}

export class Agent {
  UserRsID: number;
  UserType: string;
  Actif: boolean;
  Login: string;
  Nom: string;
  Prenom: string;
  Telephone: string;
  Email: string;
  Ville: string;
  Marques: MARQUE[];
  Articles: AgentArticle[];
}

class MARQUE {
  MarqueID: number;
  marqueLibele: string;
}

interface AgentArticle {
  ArticleID: string;
  CodeCroquis: string;
  CodePieceMere: string;
  DesignationArticle: string;
}
