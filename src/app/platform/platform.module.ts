import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformRoutingModule } from './platform-routing.module';
import { PlatformComponent } from './platform/platform.component';
import { SharedModule } from '../shared/shared.module';
import { PlatformHomeComponent } from './platform-home/platform-home.component';

@NgModule({
  imports: [CommonModule, PlatformRoutingModule, SharedModule],
  declarations: [PlatformComponent, PlatformHomeComponent]
})
export class PlatformModule {}
