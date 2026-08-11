import { Component, input, output } from "@angular/core";
import { PlaylistEntry } from "../../models/playlist-entry";
import { QuotaCheckComponent } from "../quota-check/quota-check.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconButton } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "app-playlist-entry",
  imports: [
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatIconButton,
    MatButtonToggleModule,
    QuotaCheckComponent,
  ],
  templateUrl: "./playlist-entry.component.html",
  styleUrl: "./playlist-entry.component.scss",
})
export class PlaylistEntryComponent {
  input = input.required<PlaylistEntry>();
  action = input<string>("view");
  // Outputs
  deletion = output<number>();
  saved = output();
  cancelled = output();

  onEntryDeleted() {
    this.deletion.emit(this.input().index);
  }

  onNewEntrySaved() {
    this.saved.emit();
  }

  onNewEntryCancelled() {
    this.cancelled.emit();
  }
}
