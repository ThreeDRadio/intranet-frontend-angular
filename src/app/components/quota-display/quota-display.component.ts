import { Component, input } from "@angular/core";
import { DurationIndicatorComponent } from "../duration-indicator/duration-indicator.component";
import { QuotaIndicatorComponent } from "../quota-indicator/quota-indicator.component";
import { QuotaCountComponent } from "../quota-count/quota-count";

@Component({
  selector: "app-quota-display",
  imports: [
    QuotaIndicatorComponent,
    QuotaCountComponent,
    DurationIndicatorComponent,
  ],
  templateUrl: "./quota-display.component.html",
  styleUrl: "./quota-display.component.scss",
})
export class QuotaDisplayComponent {
  quotas = input.required();
  counts = input();
  totalDuration = input.required();
  complete = input<boolean>();
}
