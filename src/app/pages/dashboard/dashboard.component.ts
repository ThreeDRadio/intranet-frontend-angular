import { Component, computed, inject, signal } from "@angular/core";
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
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../services/user.service";

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
    MatButtonModule,
    PlayControllerComponent,
  ],
})
export class DashboardComponent {
  public groups = Groups;
  public appVersion: string = packageJson.version;
  private store: Store<any> = inject(Store);
  private userService = inject(UserService);
  sidenavCollapsed = signal<boolean>(false);

  hasPlaylists = computed(() => {
    const user = this.userService.getLoggedInUser();
    return (
      user?.groups?.indexOf(Groups.Presenters) > -1 ||
      user?.groups?.indexOf(Groups.PlaylistEditors) > -1
    );
  });

  hasMessageBank = computed(() => {
    const user = this.userService.getLoggedInUser();
    return user?.groups?.indexOf(Groups.MessageBank) > -1;
  });

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }

  toggleSidenav() {
    this.sidenavCollapsed.set(!this.sidenavCollapsed());
  }
}
