import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MenuComponent } from './shell/menu/menu.component';
import { UserService } from './services/user.service';
import { JwtService } from './services/jwt.service';
import { RouterModule } from '@angular/router';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgProgressRouterModule,
    NgProgressHttpModule
  ],
  providers: [UserService, JwtService],
  declarations: [MenuComponent],
  exports: [MenuComponent, NgProgressRouterModule, NgProgressHttpModule]
})
export class CoreModule {}
