import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from '../../store/actions/auth.actions';
import * as selectors from '../../store/selectors/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'nf-login-page',
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
    this.error = this.store.select(selectors.getError);
    this.loading = this.store.select(selectors.getLoading);
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
