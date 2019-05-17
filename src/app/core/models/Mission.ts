import { Global, Ville } from './global';

export class Mission {
  id: number;
  NumMission: string;
  Status: string;
  DateAccident: string;
  Matricule: string;
  Model: string;
  Marque: string;
  DateMEC: string;
  DateOperation: string;
  NumChassi: string;
  Compagnie: any;
  CompagnieAdv: any;
  Expert: any;
  Garage: any;
  MontantTTC: string;
  VilleAccident: Ville;
  CotationEnteteIDAGT: string;
  // new Props
  NPoliceAssurance: string;
  NPoliceAssuranceAdv: string;
  VilleExpertis: string;
  referenceCie: string;
  typeMission: string;
  Agents?: string[];
}
export class MissionSelected {
  Misson: string;
  selected: boolean;
  vehicule: string;
  vehiculeBoolean: boolean;
}
