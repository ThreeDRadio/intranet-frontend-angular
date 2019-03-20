import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { getLoggedInUser } from 'app/store/selectors';
import { Subscription } from 'rxjs';

@Directive({ selector: '[inGroup]' })
export class InGroupDirective {
  private targetGroup: string;
  private sub: Subscription;
  private groups: Array<string> = [];

  constructor(
    private store: Store<any>,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    this.sub = this.store.select(getLoggedInUser).subscribe(user => {
      if (user && user.groups) {
        this.groups = user.groups;
      } else {
        this.groups = [];
      }
      this.update();
    });
  }

  @Input()
  set inGroup(value: string) {
    this.targetGroup = value;
    this.update();
  }

  private update() {
    this.viewContainerRef.clear();
    if (this.groups.includes(this.targetGroup)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
