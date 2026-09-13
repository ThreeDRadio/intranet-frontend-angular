import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButton } from "@angular/material/button";
import { BaseApi } from "../../services";

@Component({
  selector: "app-topnav",
  templateUrl: "./topnav.component.html",
  styleUrls: ["./topnav.component.scss"],
  imports: [MatToolbar, MatButton],
})
export class TopNavComponent {
  private baseApi = inject(BaseApi);

  @Output() logout = new EventEmitter<any>();

  canLogout = computed(() => this.baseApi.isLoggedIn());
}
