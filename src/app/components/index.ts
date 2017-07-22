import {NgModule} from '@angular/core';
import {MaterialModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';


const COMPONENTS = [SidebarComponent];

@NgModule({
  declarations: [SidebarComponent],
  imports: [MaterialModule, RouterModule],
  exports: [COMPONENTS]
})
export class ComponentsModule {
}
