import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { SupporterActions } from 'app/supporters/store/supporter/supporter.actions';
import { SupporterSelectors } from 'app/supporters/store/supporter/supporter.selectors';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-supporter-detail',
  templateUrl: './supporter-detail.html',
  styleUrls: ['./supporter-detail.scss']
})
export class SupporterDetailComponent {
  supporter$: Observable<any>;
  notes$: Observable<Array<any>>;
  transactions$: Observable<Array<Comment>>;

  form = new FormGroup({
    first_name: new FormControl(),
    last_name: new FormControl(),
    address1: new FormControl(),
    address2: new FormControl(),
    town: new FormControl(),
    state: new FormControl(),
    postcode: new FormControl(),
    country: new FormControl(),
    phone_mobile: new FormControl(),
    email: new FormControl()
  });

  supporterChanges: Subscription;

  constructor(private store: Store<any>, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.store.dispatch(new SupporterActions.RequestById(params.id));

      this.supporter$ = this.store
        .select(SupporterSelectors.getEntities)
        .pipe(map(entities => entities[params.id]));

      this.supporterChanges = this.supporter$.subscribe(supporter => {
        if (supporter) {
          this.form.patchValue(supporter);
        }
      });
    });
  }

  destructor() {}
}
