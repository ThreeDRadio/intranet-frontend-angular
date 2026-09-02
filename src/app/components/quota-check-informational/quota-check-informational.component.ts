import { Component, inject, input } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-quota-check-informational",
  imports: [MatIconModule],
  templateUrl: "./quota-check-informational.component.html",
  styleUrl: "./quota-check-informational.component.scss",
})
export class QuotaCheckInformationalComponent {
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  icon = input.required<string>();
  svg = input<boolean>();
  state = input.required<string>();

  constructor() {
    this.iconRegistry.addSvgIcon(
      "local-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/local.svg"),
    );
    this.iconRegistry.addSvgIcon(
      "aus-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/aus.svg"),
    );
  }
}
