export class Historique {
    'Id': number;
    'dateEnvoi': Date;
    'Operation': string;
    'Emetteur': string;
    'Recepteurs': {
        'AGT': string[];
        'OP': string[];
        'Cies': string[];
    }
}