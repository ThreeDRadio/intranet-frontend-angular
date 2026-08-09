import { Component, computed, inject, Signal, OnInit } from "@angular/core";
import { LoggerStore } from "../../store/logger.store";
import { ActivatedRoute } from "@angular/router";
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

@Component({
  selector: "app-playlist-editor",
  imports: [
    QuotaDisplayComponent,
    PlaylistEntryListComponent,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ConfirmationDialogComponent,
  ],
  providers: [QuotaService, DateService],
  templateUrl: "./playlist-editor.html",
  styleUrl: "./playlist-editor.scss",
})
export class PlaylistEditorPage implements OnInit {
  store = inject(LoggerStore);
  quotaService = inject(QuotaService);
  dateService = inject(DateService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  readonly playlist = computed(() =>
    this.store.playlistById()(Number(this.route.snapshot.paramMap.get("id"))),
  );
  readonly show = computed(
    () => this.store.showById()(this.playlist().show) ?? undefined,
  );

  entries = computed(() => this.store.playlistEntries());

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

  ngOnInit() {
    this.store.fetchPlaylistEntries(this.playlist()?.id);
  }

  onEntryDeleted(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete",
        message: "Are you sure you want remove this entry?",
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let atIndex = this.entries().find((e) => e.index === index);

        if (atIndex) {
          this.store.deletePlaylistEntry(atIndex.id);
        }
      }
    });
  }
}
