import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopNavComponent {
  @Output() logout = new EventEmitter<any>();
}
