import { Component, inject } from "@angular/core";
import { SearchStore } from "../../store/search.store";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ReleaseListComponent } from "../release-list/release-list.component";

@Component({
  selector: "app-quick-search",
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReleaseListComponent,
  ],
  templateUrl: "./quick-search.component.html",
  styleUrl: "./quick-search.component.scss",
})
export class QuickSearchComponent {
  searchStore = inject(SearchStore);

  form = new UntypedFormGroup({
    search: new UntypedFormControl("", Validators.required),
  });

  quickSearch() {
    this.searchStore.quickSearch("test");
  }
}
