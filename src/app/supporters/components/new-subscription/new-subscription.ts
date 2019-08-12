import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment-timezone';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-subscription',
  templateUrl: './new-subscription.html',
  styleUrls: ['./new-subscription.scss']
})
export class NewSubscriptionComponent {
  form = new FormGroup({
    transaction_type: new FormControl('', Validators.required),
    expires_at: new FormControl(
      moment()
        .add(1, 'years')
        .format('YYYY-MM-DD'),
      Validators.required
    ),
    payment_processed: new FormControl(false),
    pack_sent: new FormControl(false),
    shipping: new FormControl('', Validators.required),
    note: new FormControl()
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
    this.dialogRef.close(this.form.value);
  }
}
