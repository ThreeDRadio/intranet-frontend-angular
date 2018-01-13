import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from 'app/store/actions/auth.actions';
import * as selectors from 'app/store/reducers/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sd-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginPageComponent implements OnInit {
  jwt: string;
  organisationId: string;

  error: Observable<string>;
  loading: Observable<boolean>;

  attempts = 0;
  constructor(private route: ActivatedRoute, public store: Store<any>) {
    this.error = this.store.select(selectors.auth.getError);
    this.loading = this.store.select(selectors.auth.getLoading);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jwt = params.jwt;
      this.organisationId = params.organisationId;
    });
  }

  login(payload: any) {
    this.store.dispatch(new actions.RequestAuthLoginAction(payload));
  }
}
