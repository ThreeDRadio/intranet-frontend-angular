import { Component, input } from "@angular/core";
import { DurationIndicatorComponent } from "../duration-indicator/duration-indicator.component";
import { QuotaIndicatorComponent } from "../quota-indicator/quota-indicator.component";

@Component({
  selector: "app-quota-display",
  imports: [QuotaIndicatorComponent, DurationIndicatorComponent],
  templateUrl: "./quota-display.component.html",
  styleUrl: "./quota-display.component.scss",
})
export class QuotaDisplayComponent {
  quotas = input.required();
  totalDuration = input.required();
}
