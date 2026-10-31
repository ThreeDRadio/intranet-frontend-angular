import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ReleaseActions } from "app/store";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Observable } from "rxjs";
import { ReleaseSelectors } from "app/store/selectors/release.selectors";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";
import { ReleaseListComponent } from "../../components/release-list/release-list.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-catalogue-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatProgressBar,
    ReleaseListComponent,
    MatPaginator,
    AsyncPipe,
  ],
})
export class SearchComponent implements OnInit {
  form = new UntypedFormGroup({
    search: new UntypedFormControl("", Validators.required),
  });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store: Store<any> = inject(Store<any>);

  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  pageSizes = [10, 20, 50, 100];

  offset = 0;
  pageSize = 20;
  ordering = "-createwhen";

  search() {
    if (this.form.valid) {
      this.store.dispatch(
        new ReleaseActions.RequestSearch({
          ...this.form.value,
          offset: this.offset,
          limit: this.pageSize,
          ordering: this.ordering,
        }),
      );
      // keep the search term for the user.
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          term: this.form.value.search,
          offset: this.offset,
          limit: this.pageSize,
        },
      });
    }
  }

  open(release) {
    this.router.navigate(["releases", release.id]);
  }

  paginationChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * this.pageSize;
    this.search();
  }

  sort(event: Sort) {
    this.ordering = (event.direction === "asc" ? "" : "-") + event.active;
    this.search();
  }

  constructor() {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.results$ = this.store.select(ReleaseSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }

  ngOnInit() {
    // Re-search if user has parameters set.
    const term = this.route.snapshot.queryParamMap.get("term");

    if (term) {
      this.form.controls.search.setValue(term);
      const offset =
        this.route.snapshot.queryParamMap.get("offset") ?? this.offset;
      const limit =
        this.route.snapshot.queryParamMap.get("limit") ?? this.pageSize;

      if (Number.isFinite(Number(offset))) {
        this.offset = Number(offset);
      }

      if (Number.isFinite(Number(limit))) {
        this.pageSize = Number(limit);
      }

      this.search();
    } else {
      // Clear the existing search results.
      this.store.dispatch(new ReleaseActions.Clear());
    }
  }
}
