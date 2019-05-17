import { Component, ComponentRef, EventEmitter } from '@angular/core';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserTypes } from '../comptes.component';
import { take, shareReplay, share } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/apiServices/global.service';
import { ParamService } from 'src/app/core/apiServices/param.service';
import { AlertService } from 'src/app/core/apiServices/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserNameAvailablity } from '../validators/username.validator';
import { doActionForAllFormFields } from 'src/app/core/utils-services/utils';
import { BuiltinType } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';

type LoadingType = 'true' | 'false' | 'error'

@Component({
  templateUrl: 'user-dialog.component.html',
  styles: [
    `
      .close {
        font-size: 1rem;
        text-shadow: none;
        float: none;
      }
      .badge.gray {
        background-color: #dbdbdb;
        color: #333333;
      }
    `
  ]
})
export class UserDialogComponent implements IModalDialog {
  userForm: FormGroup;
  toBeCreatedUserType: UserTypes;
  connectedCompanyId: number;
  user: any;
  actionFinished: EventEmitter<any>;
  action: 'add' | 'update' | 'view';
  allMarks: any[];
  allCompanies: any[];
  allCities: any[];
  allMissionTypes: any[];
  displayedMarks = [];
  displayedMissionTypes = [];
  isSubmitting: boolean = false;
  loading = 'true';
  $loading = new BehaviorSubject<LoadingType>('true')
  options: Partial<IModalDialogOptions<any>>;
  userId: number;
  get f() {
    return this.userForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private paramService: ParamService,
    private alertService: AlertService,
    private userService: UserService
  ) { }

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.options = options;
    this.userId = options.data.userId;
    // get data from parent component
    this.action = options.data.action;
    this.toBeCreatedUserType = options.data.userType;
    this.connectedCompanyId = +this.userService.getUserInfo().CompagnieID;
    this.actionFinished = options.data.actionFinished;
    // initialize user form with validators;
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: [null],
      phone: ['', Validators.pattern(/^-?([0-9]\d*)?$/)],
      email: ['', Validators.email],
      isActive: [true],
      cityName: [''],
      companyId: [''],
      marks: [null],
      missionTypes: [null]
    });
    if (this.action !== 'view') {
      this.globalService
        .getVilles()
        .subscribe(
          (cities: any[]) =>
            (this.allCities = cities
              .map(c => ({ id: c.id, libelle: c.libelle.toUpperCase() }))
              .sort())
        );
    }
    // if action is view get user data and disable all form fields than return.
    if (this.action === 'update' || this.action === 'view') {
      this.getUserData(options.data.userId);
      // if (this.action === 'view') {
      //   doActionForAllFormFields(this.userForm, 'disable');
      //   options.actionButtons = [
      //     {
      //       text: 'OK',
      //       buttonClass: 'btnAct',
      //       onAction: () => true
      //     }
      //   ];
      //   // return;
      // }
    } else {
      this.$loading.next('false')
      this.f.password.setValidators(Validators.required);
    }

    this.setButtons();
    if (this.toBeCreatedUserType === 'administrateur') {
      this.globalService.getCompagnies().subscribe(companies => {
        this.allCompanies = [{ id: 0, libelle: 'GEPEX' }, ...companies];
      });
    } else {
      if (this.connectedCompanyId === 0) {
        this.f.companyId.setValue(0);
        this.globalService.getMarques().subscribe(marks => {
          this.allMarks = marks;
        });
      } else {
        this.globalService.getTypeMissions().subscribe(types => {
          this.allMissionTypes = types;
        });
      }
    }
  }

  setButtons() {
    if (this.action == 'view') {
      doActionForAllFormFields(this.userForm, 'disable');
      this.options.actionButtons = [
        {
          text: 'OK',
          buttonClass: 'btnAct',
          onAction: () => true
        }
      ];
      this.$loading.pipe(share()).subscribe(e => {
        switch (e) {
          case 'error':
            let btn = this.options.actionButtons.find(e => e.text === 'ENREGISTRER' || e.text === 'REESSAYER');
            console.log(btn);

            if (btn) {
              btn.text = 'REESSAYER',
                btn.onAction = () => this.getUserData(this.options.data.userId)
            }
            else {
              this.options.actionButtons.push({
                text: 'REESSAYER',
                buttonClass: 'btnAct success',
                onAction: () => this.getUserData(this.options.data.userId)
                // onAction: () => {
                //   this.options.actionButtons.find(e => e.text === 'ENREGISTRER' ).text = 'ENREGISTRER22',
                //   this.options.actionButtons.find(e => e.text === 'ENREGISTRER' ).buttonClass = 'btnAct load',
                //   this.onAction()
                // }
              })
            }
            break;

          default:
            break;
        }
      });
    }
    else {
      const btnAnnuler: IModalDialogButton = 
        {
          text: 'ANNULER',
          buttonClass: 'btnAct',
          onAction: () => true
        }
      ;
      console.log(btnAnnuler , 'btn anu');
      
      this.options.actionButtons = [{
        text: 'ANNULER',
        buttonClass: 'btnAct',
        onAction: () => true
      }];
      this.$loading.pipe(share()).subscribe(e => {
        switch (e) {

          case 'false':
            if (!this.options.actionButtons.find(e => e.text == 'ENREGISTRER')) {
              this.options.actionButtons.push({
                text: 'ENREGISTRER',
                buttonClass: 'btnAct success',
                onAction: () => this.onAction()
                // onAction: () => {
                //   this.options.actionButtons.find(e => e.text === 'ENREGISTRER' ).text = 'ENREGISTRER22',
                //   this.options.actionButtons.find(e => e.text === 'ENREGISTRER' ).buttonClass = 'btnAct load',
                //   this.onAction()
                // }
              })
            }

            break;
          case 'error':
            let btn = this.options.actionButtons.find(e => e.text === 'ENREGISTRER' || e.text === 'REESSAYER');
            console.log(btn);

            if (btn) {
              btn.text = 'REESSAYER',
                btn.onAction = () => this.getUserData(this.options.data.userId)
            }
            else {
              this.options.actionButtons.push({
                text: 'REESSAYER',
                buttonClass: 'btnAct success',
                onAction: () => this.getUserData(this.options.data.userId)
              })
            }
            break;
          case 'true':
            this.options.actionButtons.splice(1);
            break;
          default:
            break;
        }

      });
    }
    // create dialog buttons for add or update.


  }

  getUserData(userId) {
    this.$loading.next('true');
    // this.loading = 'true';
    this.paramService.getUser(userId).subscribe(
      user => {
        this.$loading.next('false');
        // this.loading = 'false';
        this.user = user;
        this.f.firstname.setValue(user.prenom);
        this.f.lastname.setValue(user.nom);
        this.f.username.setValue(user.login);
        this.f.phone.setValue(user.telephone);
        this.f.email.setValue(user.email);
        this.f.isActive.setValue(user.isActif);
        this.f.cityName.setValue(user.ville.toUpperCase());
        if (this.toBeCreatedUserType === 'administrateur') {
          this.f.companyId.setValue(
            this.action === 'update'
              ? this.allCompanies.find(
                c => c.libelle.toLowerCase() === user.compagnie.toLowerCase()
              ).id
              : user.compagnie
          );
        } else {
          if (this.connectedCompanyId === 0) {
            this.f.marks.setValue(user.marques);
            this.f.marks.setValidators(Validators.required);
            this.markSelected();
          } else {
            this.f.missionTypes.setValue(user.typeMissions);
            this.f.missionTypes.setValidators(Validators.required);
            this.missionTypeSelected();
          }
        }
        this.f.username.setAsyncValidators(
          UserNameAvailablity.createValidator(this.paramService, this.user.login)
        );
      },
      error => {
        setTimeout(() => {
          this.$loading.next('error')
        }, 1500);

        // let btn = this.options.actionButtons.find(e => e.text === 'ENREGISTRER' || e.text === 'REESSAYER');
        // btn.text = 'REESSAYER';
        // btn.buttonClass = 'btnAct warning'
        // btn.onAction = () => this.getUserData(this.options.data.userId);
        // this.loading = 'error';
      })
  }

  onAction() {
    console.log(this.loading);

    if (this.loading === 'error') {
      console.log('error');

    } else {

    }
    this.isSubmitting = true;
    console.log(this.isSubmitting);
    if (this.userForm.invalid) {
      doActionForAllFormFields(this.userForm, 'touch');
      this.isSubmitting = false;
      return;
    }
    this.user = {
      id: this.action === 'add' ? 0 : +this.user.id,
      type:
        this.toBeCreatedUserType === 'administrateur'
          ? 'Administrateur'
          : this.toBeCreatedUserType,
      prenom: this.f.firstname.value,
      nom: this.f.lastname.value,
      login: this.f.username.value,
      password: this.f.password.value,
      telephone: this.f.phone.value,
      email: this.f.email.value,
      isActif: this.f.isActive.value,
      ville: this.f.cityName.value,
      compagnieID:
        this.toBeCreatedUserType === 'administrateur'
          ? +this.f.companyId.value
          : +this.userService.getUserInfo().CompagnieID,
      marquesIds:
        this.toBeCreatedUserType !== 'administrateur' &&
          this.connectedCompanyId === 0
          ? this.f.marks.value.map(v => +v.id)
          : null,
      typeMissionIds:
        this.connectedCompanyId !== 0
          ? this.f.missionTypes.value.map(v => +v.id)
          : null
    };
    return new Promise((resolve, reject) =>
      this.paramService.createOrUpdateUser(this.action, this.user).subscribe(
        id => {

          this.isSubmitting = false;
          this.alertService.success({
            msg: `L\'utilisateur ${this.user.prenom} est ${
              this.action === 'add' ? 'ajouté' : 'modifié'
              } avec succée.`
          });
          this.user.id = this.action === 'add' ? id : this.user.id;
          if (this.toBeCreatedUserType === 'administrateur') {
            this.user.compagnie = this.allCompanies.find(
              c => +c.id === +this.user.compagnieID
            ).libelle;
          } else {
            if (this.connectedCompanyId === 0) {
              this.user.Marques = this.f.marks.value
                .slice(0, 3)
                .map(v => v.libelle);
            } else {
              this.user.TypeMissions = this.f.missionTypes.value
                .slice(0, 3)
                .map(v => v.libelle);
            }
          }
          this.actionFinished.emit(this.user);
          resolve();
        },
        err => {

          this.isSubmitting = false;
          this.alertService.error({ msg: err.error.Message });

          resolve();
        }
      )
    );
  }

  markSelected(event?) {
    this.displayedMarks = this.f.marks.value.map(v => v.libelle);
    this.displayedMarks.sort();
  }

  missionTypeSelected(event?) {
    this.displayedMissionTypes = this.f.missionTypes.value.map(v => v.libelle);
    this.displayedMissionTypes.sort();
  }
}
