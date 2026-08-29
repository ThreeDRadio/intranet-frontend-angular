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
import { ReleaseListCompactComponent } from "../release-list-compact/release-list-compact.component";

@Component({
  selector: "app-quick-search",
  imports: [
    ReleaseListCompactComponent,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
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
    this.searchStore.quickSearch({
      term: this.form.controls.search.value,
      size: 10,
      offset: 0,
    });
  }
}
