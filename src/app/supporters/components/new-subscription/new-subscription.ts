import { Component, Inject, Optional } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import * as moment from "moment-timezone";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-new-subscription",
  templateUrl: "./new-subscription.html",
  styleUrls: ["./new-subscription.scss"],
})
export class NewSubscriptionComponent {
  form = new FormGroup({
    transaction_type: new FormControl("", Validators.required),
    expires_at: new FormControl(
      moment().add(1, "years").format("YYYY-MM-DD"),
      Validators.required
    ),
    payment_processed: new FormControl(false),
    pack_sent: new FormControl(false),
    shipping: new FormControl("", Validators.required),
    note: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<NewSubscriptionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  addSubscription() {
    const subDetails = {
      ...this.form.value,
      // the date picker returns a date object, that needs to be converted
      // to YYYY-MM-DD and unfortunately nothing in the effect knows how
      // to deal with the data at all, so we're doing it here
      expires_at: moment(this.form.controls["expires_at"].value).format(
        "YYYY-MM-DD"
      ),
    };
    this.dialogRef.close(subDetails);
  }
}
