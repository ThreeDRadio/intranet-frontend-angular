import { Component, Inject, Optional } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";

import * as moment from "moment-timezone";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-new-subscription",
  templateUrl: "./new-subscription.html",
  styleUrls: ["./new-subscription.scss"],
})
export class NewSubscriptionComponent {
  form = new UntypedFormGroup({
    transaction_type: new UntypedFormControl("", Validators.required),
    expires_at: new UntypedFormControl(
      moment().add(1, "years").format("YYYY-MM-DD"),
      Validators.required
    ),
    payment_processed: new UntypedFormControl(false),
    pack_sent: new UntypedFormControl(false),
    shipping: new UntypedFormControl("", Validators.required),
    note: new UntypedFormControl(),
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
