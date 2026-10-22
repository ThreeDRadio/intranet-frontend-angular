import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { getLoggedInUser } from "../store/selectors/auth.selectors";
import { md5 } from "js-md5";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private store: Store<any> = inject(Store<any>);

  getLoggedInUser() {
    var user = this.store.selectSignal(
      (state) => getLoggedInUser(state) ?? null,
    );
    return user();
  }

  getGravatarUrl(user) {
    const name = user.email ?? user.username;
    const hashHex = md5(name.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hashHex}`;
  }
}
