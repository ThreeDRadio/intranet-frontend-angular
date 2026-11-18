import { Component, effect, inject, OnInit } from "@angular/core";
import { MessageBankService } from "../../services/message-bank.service";
import { MessageBankStore } from "../../store/message-bank.store";
import { MessageHeader } from "../../components/message-header/message-header";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-messages",
  imports: [
    MessageHeader,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: "./view-messages.html",
  styleUrl: "./view-messages.scss",
})
export class ViewMessagesPage implements OnInit {
  private defaultMessageType = "all";
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  mbStore = inject(MessageBankStore);

  filterFormGroup = new FormGroup({
    typeFilterSelector: new FormControl(this.defaultMessageType),
  });

  constructor() {
    const onTypesLoaded = effect(() => {
      const mt = this.route.snapshot.queryParamMap.get("mt");

      if (mt) {
        if (!this.mbStore.isLoadingTypes() && this.mbStore.hasMessageType(mt)) {
          // Check if this message type actually exists before setting anything.
          this.filterFormGroup.controls.typeFilterSelector.setValue(mt);
          this.mbStore.searchMessages({ type: mt, current: true });
          onTypesLoaded.destroy();
        }
      } else {
        this.mbStore.fetchMessages();
        onTypesLoaded.destroy();
      }
    });
  }

  ngOnInit() {
    this.mbStore.fetchTypes();
  }

  onTypeFilterChanged(event: MatSelectChange) {
    if (event.value.toLowerCase() === this.defaultMessageType.toLowerCase()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          mt: null,
        },
      });
      // No type filter
      this.mbStore.fetchMessages();
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          mt: this.filterFormGroup.value.typeFilterSelector,
        },
      });
      this.mbStore.searchMessages({ type: event.value, current: true });
    }
  }
}
