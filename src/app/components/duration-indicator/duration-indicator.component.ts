import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-duration-indicator",
  imports: [MatIcon],
  templateUrl: "./duration-indicator.component.html",
  styleUrl: "./duration-indicator.component.scss",
})
export class DurationIndicatorComponent {
  duration = input.required<string>();
}
