import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss'],
    imports: [MatToolbar, MatButton]
})
export class TopNavComponent {
  @Output() logout = new EventEmitter<any>();
}
