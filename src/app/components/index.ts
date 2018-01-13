import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from 'app/components/login/login.component';

import { SidebarComponent } from './sidebar/sidebar.component';

const COMPONENTS = [SidebarComponent, LoginFormComponent];

@NgModule({
  declarations: [SidebarComponent],
  imports: [MaterialModule, RouterModule],
  exports: [COMPONENTS]
})
export class ComponentsModule {}
