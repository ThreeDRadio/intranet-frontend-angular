import { Component, computed, input } from "@angular/core";
import { MatIcon, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { QuotaResult } from "../../services/quota.service";

@Component({
  selector: "app-quota-indicator",
  imports: [MatIcon],
  templateUrl: "./quota-indicator.component.html",
  styleUrl: "./quota-indicator.component.scss",
})
export class QuotaIndicatorComponent {
  icon = input.required<string>();
  svg = input<boolean>();
  quota = input.required<QuotaResult>();

  readonly met = computed(() => this.quota().meets);

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      "sa-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/sa.svg"),
    );
    iconRegistry.addSvgIcon(
      "aus-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/aus.svg"),
    );
  }
}
