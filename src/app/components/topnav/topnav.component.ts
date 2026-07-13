import { Component, EventEmitter, Output } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: "app-topnav",
  imports: [MatToolbar],
  templateUrl: "./topnav.component.html",
  styleUrls: ["./topnav.component.scss"],
})
export class TopNavComponent {
  @Output() logout = new EventEmitter<any>();
}
