import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { RequestAuthLogoutAction } from "../../store";
import { Groups } from "app/constants";
import { PlayControllerComponent } from "app/components/play-controller/play-controller.component";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
import { MatNavList } from "@angular/material/list";
import { TopNavComponent } from "app/components/topnav/topnav.component";

@Component({
  // dashboard is one word. No kebab case required. GO AWAY
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "dashboard",
  imports: [
    PlayControllerComponent,
    MatIcon,
    MatToolbar,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RouterOutlet,
    TopNavComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  public groups = Groups;

  constructor(private store: Store<any>) {}

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }
}
