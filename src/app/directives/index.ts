import { InGroupDirective } from './in-group.directive';
import { NgModule } from '@angular/core';

const DIRECTIVES = [InGroupDirective];

@NgModule({
    imports: [...DIRECTIVES],
    exports: DIRECTIVES
})
export class DirectivesModule {}
