import {
  Component,
  OnInit,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import { ParamService } from '../../core/apiServices/param.service';
import { take } from 'rxjs/operators';
import { ModalDialogService } from 'ngx-modal-dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/core/apiServices/alert.service';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrls: ['./comptes.component.css']
})
export class ComptesComponent implements OnInit {
  activeId: UserTypes = 'operateur';
  connectedCompanyId: number;
  connectedUserType: string;
  dataSource: { Result: User[]; Count: number };
  columns = [];
  displayedColumns: string[];

  userTypes(withPlural: boolean) {
    const types =
      +this.userService.getUserInfo().CompagnieID === 0
        ? ['Operateurs', 'Agents', 'Administrateurs']
        : ['Operateurs'];
    return withPlural ? types : types.map(t => t.toLowerCase().slice(0, -1));
  }

  constructor(
    private paramSvc: ParamService,
    private modalDialogService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.connectedCompanyId = +userService.getUserInfo().CompagnieID;
    this.connectedUserType = userService.getUserInfo().UserType;
  }

  ngOnInit() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'No.',
        cell: (user: User) => `${user.id}`
      },
      {
        columnDef: 'status',
        header: 'Status',
        cell: (user: User) =>
          user.isDeleted
            ? '<span class="badge badge-pill badge-danger" placement="left" ngbTooltip="Restaurer">supprimé</span>'
            : `<span class= "badge badge-pill ${
                user.isActif ? 'badge-success' : 'badge-secondary'
              }" > ${user.isActif ? '' : 'in'}actif </span>`
      },
      {
        columnDef: 'nom',
        header: 'Nom',
        cell: (user: User) => `${user.nom}`
      },
      {
        columnDef: 'prenom',
        header: 'Prénom',
        cell: (user: User) => `${user.prenom}`
      },
      {
        columnDef: 'login',
        header: 'Nom Utilisateur',
        cell: (user: User) => `${user.login}`
      },
      {
        columnDef: 'telephone',
        header: 'Téléphone',
        cell: (user: User) => `${user.telephone}`
      },
      {
        columnDef: 'email',
        header: 'E-mail',
        cell: (user: User) => `${user.email}`
      },
      {
        columnDef: 'ville',
        header: 'Ville',
        cell: (user: User) => `${user.ville}`
      },
      {
        columnDef: 'marques',
        header: 'Quelques Marques',
        cell: (user: User) =>
          (user.Marques || [])
            .map(
              m =>
                `<span class= "badge badge-pill badge-primary-gray"> ${m} </span>`
            )
            .join(' ')
      },
      {
        columnDef: 'types',
        header: 'Types Mission',
        cell: (user: User) =>
          (user.TypeMissions || [])
            .map(
              m =>
                `<span class= "badge badge-pill badge-primary-gray"> ${m} </span>`
            )
            .join(' ')
      },
      {
        columnDef: 'compagnie',
        header: 'Compagnie',
        cell: (user: User) => `${user.compagnie}`
      }
    ];
    this.tabChanged(this.activeId);
  }

  actionOnUser(action: 'add' | 'update' | 'view', userType?: string, userId?) {
    const actionFinished = new EventEmitter<any>();
    this.modalDialogService.openDialog(this.viewRef, {
      title:
        action === 'add'
          ? `Nouveau ${userType.replace(
              userType[0],
              userType[0].toUpperCase()
            )}`
          : `${action === 'update' ? 'Modification' : 'Details'} Utilisateur`,
      childComponent: UserDialogComponent,
      data: {
        userId: userId,
        action: action,
        userType: action === 'add' ? userType : this.activeId,
        actionFinished: action === 'view' ? null : actionFinished
      },
      settings: {
        notifyWithAlert: false,
        modalDialogClass: 'modal-dialog modal-dialog-centered min-width-800'
      }
    });
    actionFinished.pipe(take(1)).subscribe((user: User) => {
      if (
        this.dataSource.Result[0].type.toLowerCase() !== user.type.toLowerCase()
      ) {
        return;
      }
      if (action === 'add') {
        this.dataSource.Result = this.dataSource.Result.slice(0, -1);
        this.dataSource.Result.splice(0, 0, user);
      } else {
        const userToUpdate = this.dataSource.Result.find(
          u => +u.id === +user.id
        );
        Object.assign(userToUpdate, user);
      }
    });
  }

  deleteOrRestoreUser(userId, isDeleted: boolean) {
    this.dataSource.Result.find(
      user => user.id === userId
    ).isDeleted = isDeleted;
    this.paramSvc
      .deleteOrRestoreUser(userId, isDeleted)
      .pipe(take(1))
      .subscribe(
        success => this.alertService.success({ msg: success.Message }),
        err => this.alertService.success({ msg: err.error.Message })
      );
  }

  getUsers(userType, start?, count?) {
    this.dataSource = null;
    this.paramSvc
      .getUsers(userType, start, count)
      .pipe(take(1))
      .subscribe(res => (this.dataSource = res));
  }

  tabChanged(userType: UserTypes) {
    this.activeId = userType;
    this.getUsers(userType);
    const allColumns = this.columns.map(c => c.columnDef);
    this.displayedColumns = allColumns.filter(c => {
      switch (userType) {
        case 'administrateur':
          return c !== 'marques' && c !== 'types';
        case 'agent':
          return c !== 'compagnie' && c !== 'types';
        case 'operateur':
          return c !== 'marques' && c !== 'compagnie';
      }
    });
    this.displayedColumns.push('actions');
  }
}

export interface User {
  id: number;
  type: UserTypes;
  isActif: boolean;
  isDeleted: boolean;
  login: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  ville?: string;
  compagnieID?: number;
  garageID?: number;
  compagnie?: string;
  Marques?: string[];
  TypeMissions?: string[];
  typeMissions?: string[];
}

export type UserTypes = 'operateur' | 'agent' | 'administrateur';
