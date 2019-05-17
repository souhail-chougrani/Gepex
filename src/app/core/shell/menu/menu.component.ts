import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { take, takeUntil } from 'rxjs/operators';
import { DossiersService } from '../../apiServices/dossiers.service';
import { DossierCount } from '../../models/dossier-count';
import { CountDossiersService } from 'src/app/core/utils-services/count-dossiers.service';
import { SignalRService } from '../../services/signalr.service';
import { Notification } from '../../models/notification';
import { PushNotificationsService } from '../../services/push-notification.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  environment = environment;
  AuthSession: boolean;
  Nom: string;
  Prenom: string;
  authType: string;
  compagnieID: number;
  garageID: number;
  count = new DossierCount({});
  notifs: Notification[] = [];
  notificationsCaughtUp: boolean;
  notificationsCount = 0;
  displayedLinks: Link[];
  // link: platform/...
  platformNavigationLinks: Link[];
  // link: societe/...
  companyNavigationLinks: Link[];

  constructor(
    private loginService: UserService,
    private dosSer: DossiersService,
    private countDossiersService: CountDossiersService,
    private _signalRService: SignalRService,
    private _ngZone: NgZone,
    private pushNotificationsService: PushNotificationsService
  ) { }

  ngOnInit() {
    this.dosSer
      .getDossierCounts()

      .subscribe(res => this.countDossiersService.setCountDossiers(res));
    this.getuserInfo();
    this.countDossiersService.CountDossierSubject.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(count => {
      this.count = count;
      this.initializeNavigationLinks();
    });
    this.subscribeToNotifications();
  }

  initializeNavigationLinks() {
    this.platformNavigationLinks = [
      {
        title: 'Panier',
        link: '',
        badgeClass: 'badge-primary-gray',
        count: this.count.SelectionnesParCompagnie + this.count.FrontOffice,
        children: [
          {
            title: 'Dossiers Compagnies',
            link: 'envoyeSociete',
            count: this.count.SelectionnesParCompagnie
          },
          {
            title: 'Dossiers Gepex',
            link: 'frontOffice',
            count: this.count.FrontOffice
          },
          {
            title: 'Dossiers GepexEcom',
            link: 'ecom',
            count: this.count.Ecom
          },
          {
            title: 'Dossiers RMA',
            link: 'RMA',
            count: this.count.RMA
          }
        ]
      },
      {
        title: 'Dossier AGT',
        link: '',
        badgeClass: 'badge-warning',
        count: this.count.EnvoyesAGT + this.count.TraitesAGT,
        children: [
          {
            title: 'Envoyés à l\'AGT',
            link: 'envoyeAgt',
            count: this.count.EnvoyesAGT
          },
          {
            title: 'Traités par l\'AGT',
            link: 'traitesAgt',
            count: this.count.TraitesAGT
          }
        ]
      },
      {
        title: 'Dossiers Traités',
        link: 'traites',
        badgeClass: 'badge-success',
        count: this.count.Traites
      },
      {
        title: 'Dossiers Non Traités',
        link: '',
        badgeClass: 'badge-danger',
        count:
          this.count.Annules +
          this.count.DTD +
          this.count.PEC +
          this.count.Reforme,
        children: [
          {
            title: 'Dossiers Annulés',
            link: 'annule',
            count: this.count.Annules
          },
          {
            title: 'Durée de Traitement Dépassée',
            link: 'dtd',
            count: this.count.DTD
          },
          {
            title: 'Prise En Charge Accordée',
            link: 'pec',
            count: this.count.PEC
          },
          {
            title: 'Reformés',
            link: 'reforme',
            count: this.count.Reforme
          },
          {
            title: 'Non Traitable',
            link: 'nontraitable',
            count: this.count.Non_Traitable
          }
        ]
      }
    ];

    this.companyNavigationLinks = [
      {
        title: 'Envoyés à GEPEX',
        link: '',
        badgeClass: 'badge-warning',
        count:
          this.count.EnvoyesAGT +
          this.count.SelectionnesParCompagnie +
          this.count.TraitesAGT,
        children: [
          {
            title: 'Dossiers Chez Plateforme',
            link: 'envoyePlatform',
            count: this.count.SelectionnesParCompagnie
          },
          {
            title: 'Dossiers Chez AGT',
            link: 'entraitement',
            count: this.count.EnvoyesAGT + this.count.TraitesAGT
          }
        ]
      },
      {
        title: 'Dossiers Traités',
        link: 'traites',
        badgeClass: 'badge-success',
        count: this.count.Traites
      },
      {
        title: 'PEC Accordée',
        link: 'pec',
        badgeClass: 'badge-danger',
        count: this.count.PEC
      }
    ];

    // RMA Archive
    if (this.compagnieID === 15207) {
      this.companyNavigationLinks.push({
        title: 'Archiver',
        link: '',
        badgeClass: 'badge-dark',
        count:
          this.count.ArchiveEnCours +
          this.count.ArchiveEnAttente +
          this.count.ArchiveTraites,
        children: [
          {
            title: 'En Cours',
            link: 'ArchEncours',
            count: this.count.ArchiveEnCours
          },
          {
            title: 'Dossiers En Attente',
            link: 'ArchEnvoyePlatform',
            count: this.count.ArchiveEnAttente
          },
          {
            title: 'Dossiers Traités',
            link: 'ArchTraites',
            count: this.count.ArchiveTraites
          }
        ]
      });
    }

    this.displayedLinks = [
      ...[
        {
          title: 'Recherche',
          link: 'home'
        }
        // {
        //   title: 'Tableau de bord',
        //   link: 'dashboard'
        // }
      ],
      ...(this.authType.toLowerCase() === 'operateur' && this.compagnieID === 0
        ? []
        : [
          {
            title: 'En Cours',
            link: 'encours',
            badgeClass: 'badge-primary-gray',
            count: this.count.EnCours,
            children: [
              {
                title: 'Demande de PEC',
                link: 'DPEC',
                count: this.count.DPEC
              },
              {
                title: 'Attente de PEC',
                link: 'ATTPEC',
                count: this.count.ATTPEC
              },
              {
                title: 'Attente de Validation de  PEC',
                link: 'ATTVPEC',
                count: this.count.ATTVPEC
              },
              {
                title: 'Rejet de PEC',
                link: 'REJPEC',
                count: this.count.REJPEC
              }
            ]
          }
        ]),
      ...(this.compagnieID === 0
        ? this.platformNavigationLinks
        : this.companyNavigationLinks)
    ];
  }

  logout() {
    this.loginService.logout();
  }

  getuserInfo() {
    const userInf = this.loginService.getUserInfo();
    this.Nom = userInf.Nom;
    this.Prenom = userInf.Prenom;
    this.authType = userInf.UserType;
    this.AuthSession = this.loginService.isAuthenticated;
    this.compagnieID = +userInf.CompagnieID;
    this.garageID = +userInf.GarageID;
  }

  subscribeToNotifications(): void {
    this._signalRService.notificationReceived
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notif: any) => {
        this._ngZone.run(() => {
          this.notificationsCaughtUp = false;
          this.notifs.push(notif);
          this.notificationsCount++;
          this.pushNotificationsService.generateNotification([
            { title: 'Gepex', alertContent: notif.title }
          ]);
          this.pushNotificationsService.setBubble(this.notificationsCount);
        });
      });
    this._signalRService.countBroadCast
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((count: DossierCount) => {
        this._ngZone.run(() => {
          Object.keys(this.count).forEach(key => {
            if (Object.keys(count).includes(key)) {
              this.count[key] += count[key];
            }
          });
          this.initializeNavigationLinks();
        });
      });
  }

  clearNotifications() {
    setTimeout(() => {
      this.pushNotificationsService.setBubble(0);
      this.notificationsCaughtUp = true;
      this.notificationsCount = 0;
    }, 2000);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

interface Link {
  title: string;
  link: string;
  badgeClass?: string;
  data?: any;
  count?: number;
  children?: Link[];
}
