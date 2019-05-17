import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-societe-home',
  templateUrl: './societe-home.component.html',
  styleUrls: ['./societe-home.component.css']
})
export class SocieteHomeComponent {
  companyId: number;

  constructor(userService: UserService) {
    this.companyId = +userService.getUserInfo().CompagnieID;
  }
}
