import { Component, input, output } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PlaylistEntry } from "../../models/playlist-entry";

@Component({
  selector: "app-playlist-entry-editor",
  imports: [
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatIconButton,
    MatButtonToggleModule,
  ],
  templateUrl: "./playlist-entry-editor.component.html",
  styleUrl: "./playlist-entry-editor.component.scss",
})
export class PlaylistEntryEditorComponent {
  input = input.required<PlaylistEntry>();
  action = input.required<string>();
  deletion = output<number>();
  saved = output<void>();
  cancelled = output<void>();
}
