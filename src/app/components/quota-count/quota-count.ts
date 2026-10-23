import { Component, input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-quota-count",
  imports: [MatIconModule],
  templateUrl: "./quota-count.html",
  styleUrl: "./quota-count.scss",
})
export class QuotaCountComponent implements OnInit {
  icon = input.required<string>();
  svg = input<boolean>();
  count = input<number>();

  ngOnInit() {
    console.log(this.count());
  }
}
