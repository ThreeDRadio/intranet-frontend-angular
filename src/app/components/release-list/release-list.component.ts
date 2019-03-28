import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Release } from 'app/models/release';

@Component({
  selector: 'app-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.scss']
})
export class ReleaseListComponent {
  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];
  pageSizes = [10, 20, 50, 100];

  @Input()
  releases: Array<Release>;

  @Output()
  sortChange = new EventEmitter();

  @Output()
  open = new EventEmitter<Release>();
}
