export interface Notification {
  Emetteur: string;
  GroupRecepteur: string;
  missionIds: number[];
  Destination: string;
}

export interface StatusBroadCast {
  missionsids: number[];
  status: string;
}
