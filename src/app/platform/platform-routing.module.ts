import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformHomeComponent } from './platform-home/platform-home.component';
import { PlatformComponent } from './platform/platform.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'missions/home'
  },
  {
    path: 'missions/home',
    component: PlatformHomeComponent
  },
  {
    path: 'missions/:status',
    component: PlatformComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule {}
