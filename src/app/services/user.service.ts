import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { getLoggedInUser } from "../store/selectors/auth.selectors";

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
}
