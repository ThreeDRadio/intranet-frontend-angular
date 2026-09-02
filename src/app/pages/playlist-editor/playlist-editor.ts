import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  input,
  effect,
} from "@angular/core";
import { LoggerStore } from "../../store/logger.store";
import { Router } from "@angular/router";
import { DateService } from "../../services/date.service";
import { QuotaService } from "../../services/quota.service";
import moment from "moment";
import { QuotaDisplayComponent } from "../../components/quota-display/quota-display.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PlaylistEntryListComponent } from "../../components/playlist-entry-list/playlist-entry-list.component";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { PlaylistEntry } from "../../models/playlist-entry";
import { PlaylistEntryEditorComponent } from "../../components/playlist-entry-editor/playlist-entry-editor.component";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { PlaylistCatalogueFinder } from "../../components/playlist-catalogue-finder/playlist-catalogue-finder.component";
import { AddFromCatalogueDialogComponent } from "../../components/add-from-catalogue-dialog/add-from-catalogue-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-playlist-editor",
  imports: [
    QuotaDisplayComponent,
    PlaylistEntryEditorComponent,
    PlaylistEntryListComponent,
    PlaylistCatalogueFinder,
    // Material
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatAccordion,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  providers: [QuotaService, DateService],
  templateUrl: "./playlist-editor.html",
  styleUrl: "./playlist-editor.scss",
})
export class PlaylistEditorPage implements OnInit {
  loggerStore = inject(LoggerStore);
  quotaService = inject(QuotaService);
  dateService = inject(DateService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  // Inputs
  readonly id = input.required<number, string>({
    transform: (value: string) => Number(value),
  });

  readonly playlist = computed(() =>
    this.loggerStore.playlistById()(this.id()),
  );

  readonly show = computed(
    () => this.loggerStore.showById()(this.playlist().show) ?? undefined,
  );

  entries = computed(() => this.loggerStore.playlistEntries());

  readonly formattedDate = computed(() =>
    this.dateService.getDisplayDate(this.playlist()?.date ?? ""),
  );

  readonly totalDuration = computed(() => {
    const result = this.entries().reduce((acc, curr) => {
      return acc.add(moment.duration(curr.duration));
    }, moment.duration(0));
    return moment.utc(result.asMilliseconds()).format("HH:mm:ss");
  });

  readonly quotas = computed(() => {
    const params = {
      localQuota: this.playlist()?.localQuota ?? 0,
      australianQuota: this.playlist()?.australianQuota ?? 0,
      femaleQuota: this.playlist()?.femaleQuota ?? 0,
    };
    const input = this.entries();

    return {
      local: this.quotaService.getLocalQuota(params, input),
      australian: this.quotaService.getAustralianQuota(params, input),
      female: this.quotaService.getFemaleQuota(params, input),
    };
  });

  constructor() {
    effect(() => {
      const isComplete =
        !this.loggerStore.isLoading() && this.playlist()?.complete;

      // Playlist completion will now trigger a navigation back to recent playlists.
      // Navigate ONLY if we started a submit and the store has finished processing it
      if (isComplete) {
        this._router.navigate(["/playlists/recent"]);
      }
    });
  }

  ngOnInit() {
    this.loggerStore.fetchPlaylistAndEntries(this.id());
  }

  // Internal state
  catalogueInputSelected = signal<boolean>(false);

  private getIdx(): number {
    return this.entries().length > 0
      ? this.entries().reduce((highest, current) => {
          return current.index > highest.index ? current : highest;
        }).index + 1
      : 1;
  }

  newEntryTemplate(): PlaylistEntry {
    return {
      id: 0,
      index: this.getIdx(),
      artist: "",
      album: "",
      title: "",
      duration: "",
      local: false,
      australian: false,
      female: false,
      newRelease: false,
      playlist: this.id(),
    };
  }

  onEntrySaved(entry) {
    this.loggerStore.updatePlaylistEntry(entry);
  }

  onNewEntrySaved(entry) {
    this.loggerStore.createPlaylistEntry(entry);
  }

  // Dialogs
  onEntryDeleted(index) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Remove",
        message: "Are you sure you want remove this entry?",
        confirmButton: "Remove",
        cancelButton: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let atIndex = this.entries().find((e) => e.index === index);

        if (atIndex) {
          this.loggerStore.deletePlaylistEntry(atIndex.id);
        }
      }
    });
  }

  onAddedFromCatalogue(info) {
    const dialogRef = this._dialog.open(AddFromCatalogueDialogComponent, {
      data: {
        track: info.element,
        album: info.release.title,
        quotas: {
          local: info.release.local === 2,
          australian: info.release.local === 2,
          female: info.release.female === 2,
          newRelease: false,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const final = { ...result, playlist: this.id(), index: this.getIdx() };
        this.loggerStore.createPlaylistEntry(final);
        this._snackBar.open(
          `${final.artist} - ${final.title} added at #${final.index}`,
          "OK",
          {
            duration: 3 * 1000,
          },
        );
      }
    });
  }

  onSubmitted() {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Submit",
        message:
          "Please ensure your logging sheet is complete and correct before submitting.",
        confirmButton: "Submit",
        cancelButton: "Cancel",
        resultOutcome: "constructive",
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loggerStore.completePlaylist(this.id());
      }
    });
  }
}
