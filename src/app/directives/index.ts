import { InGroupDirective } from './in-group.directive';
import { NgModule } from '@angular/core';

const DIRECTIVES = [InGroupDirective];

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES
})
export class DirectivesModule {}
