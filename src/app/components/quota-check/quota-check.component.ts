import { Component, inject, input } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-quota-check",
  imports: [MatIconModule],
  templateUrl: "./quota-check.component.html",
  styleUrl: "./quota-check.component.scss",
})
export class QuotaCheckComponent {
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  icon = input.required<string>();
  svg = input<boolean>();
  met = input.required<boolean>();

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
