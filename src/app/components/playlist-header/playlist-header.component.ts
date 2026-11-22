import { Component, computed, inject, input } from "@angular/core";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { RouterLink } from "@angular/router";

import { Playlist } from "../../models";
import { LoggerStore } from "../../store";
import { DateService } from "../../services/date.service";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { API_URL, BaseApi } from "../../services/base-api.service";
import { UserService } from "../../services/user.service";
import { Groups } from "../../constants";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-playlist-header",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatIcon,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
  ],
  providers: [DateService],
  templateUrl: "./playlist-header.component.html",
  styleUrl: "./playlist-header.component.scss",
})
export class PlaylistHeaderComponent {
  loggerStore = inject(LoggerStore);
  apiUrl = inject(API_URL);
  dateService = inject(DateService);
  userService = inject(UserService);
  // Confirmation dialog
  private _dialog = inject(MatDialog);

  readonly playlist = input.required<Playlist>();
  readonly linkToShow = input<boolean>(true);
  readonly show = computed(() =>
    this.loggerStore.showById()(this.playlist().show),
  );
  readonly formattedDate = computed(() =>
    this.dateService.getDisplayDate(this.playlist()?.date ?? ""),
  );
  readonly isPlaylistEditor = computed(() =>
    this.userService.getLoggedInUser()?.groups.includes(Groups.PlaylistEditors),
  );

  openTextNoAlbum() {
    const id = this.playlist().id;
    const url = `${this.apiUrl}/logger/playlists/${id}?format=text`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  openTextWithAlbum() {
    const id = this.playlist().id;
    const url = `${this.apiUrl}/logger/playlists/${id}?format=text&album=true`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  openSongArtistAlbum() {
    const id = this.playlist().id;
    const url = `${this.apiUrl}/logger/playlists/${id}?format=song_artist&album=true`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  openCsv() {
    const id = this.playlist().id;
    const url = `${this.apiUrl}/logger/playlists/${id}?format=csv`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  delete() {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete logging sheet",
        message: "Are you sure you want delete this logging sheet?",
        confirmButton: "Delete",
        cancelButton: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loggerStore.deletePlaylist(this.playlist().id);
      }
    });
  }
}
