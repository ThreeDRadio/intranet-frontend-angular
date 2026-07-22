import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { RequestAuthLogoutAction } from "../../store";
import { TopNavComponent } from "../../components/topnav/topnav.component";
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from "@angular/material/sidenav";
import {
  MatNavList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatListSubheaderCssMatStyler,
} from "@angular/material/list";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { InGroupDirective } from "../../directives/in-group.directive";
import { MatToolbar } from "@angular/material/toolbar";
import { PlayControllerComponent } from "../../components/play-controller/play-controller.component";
import packageJson from "../../../../package.json";
import { getLoggedInUser } from "../../store/selectors";
import { Groups } from "../../constants";

@Component({
  // dashboard is one word. No kebab case required. GO AWAY
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  imports: [
    TopNavComponent,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    RouterLink,
    MatIcon,
    MatListItemIcon,
    MatListItemTitle,
    MatListSubheaderCssMatStyler,
    InGroupDirective,
    MatSidenavContent,
    RouterOutlet,
    MatToolbar,
    PlayControllerComponent,
  ],
})
export class DashboardComponent {
  public groups = Groups;
  public appVersion: string = packageJson.version;
  public isPresenter: boolean = true;

  constructor(private store: Store<any>) {
    this.store.select(getLoggedInUser).subscribe((user) => {
      if (user && user.groups) {
        this.isPresenter = user.groups.indexOf(Groups.Presenters) > -1;
        console.log(this.isPresenter);
      }
    });
  }

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }
}
