import { Component, inject, input, output } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistEntry } from "../../models/playlist-entry";
import { PlaylistEntryComponent } from "../playlist-entry/playlist-entry.component";
import { PlaylistEntryEditorComponent } from "../playlist-entry-editor/playlist-entry-editor.component";
import { CdkDropList } from "@angular/cdk/drag-drop";
import { LoggerStore } from "../../store";

@Component({
  selector: "app-playlist-entry-list",
  imports: [PlaylistEntryComponent, PlaylistEntryEditorComponent, CdkDropList],
  templateUrl: "./playlist-entry-list.component.html",
  styleUrl: "./playlist-entry-list.component.scss",
})
export class PlaylistEntryListComponent {
  private _loggerStore = inject(LoggerStore);

  playlist = input.required<Playlist>();
  entries = input.required<PlaylistEntry[]>();
  action = input<string>("view");

  // Outputs
  entryDeleted = output<number>();
  entrySaved = output<PlaylistEntry>();

  entryDropped(event) {
    const before = event.previousIndex + 1;
    const after = event.currentIndex + 1;
    this._loggerStore.reorderPlaylist({
      playlist: this.playlist().id,
      from: before,
      to: after,
    });
  }
}
