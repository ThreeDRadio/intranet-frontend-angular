import { Component, computed, inject, input } from "@angular/core";
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
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  icon = input.required<string>();
  svg = input<boolean>();
  quota = input.required<QuotaResult>();

  readonly met = computed(() => this.quota().meets);

  constructor() {
    this.iconRegistry.addSvgIcon(
      "sa-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/sa.svg"),
    );
    this.iconRegistry.addSvgIcon(
      "aus-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/aus.svg"),
    );
  }
}
