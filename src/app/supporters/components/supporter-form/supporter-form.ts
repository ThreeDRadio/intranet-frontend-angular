import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Supporter } from 'app/supporters/models/supporter';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-supporter-form',
  templateUrl: './supporter-form.html',
  styleUrls: ['./supporter-form.scss']
})
export class SupporterFormComponent {
  @Output()
  changes = new EventEmitter<Supporter>();

  _supporter: Supporter;

  @Input() set supporter(value) {
    this.form.patchValue(value);
    this._supporter = value;
  }

  form = new UntypedFormGroup({
    first_name: new UntypedFormControl(),
    last_name: new UntypedFormControl('', Validators.required),
    address1: new UntypedFormControl('', Validators.required),
    address2: new UntypedFormControl(),
    town: new UntypedFormControl('', Validators.required),
    state: new UntypedFormControl('SA', Validators.required),
    postcode: new UntypedFormControl('', Validators.required),
    country: new UntypedFormControl('Australia'),
    phone_mobile: new UntypedFormControl(),
    phone_home: new UntypedFormControl(),
    phone_work: new UntypedFormControl(),
    gender: new UntypedFormControl(),
    dob: new UntypedFormControl(),
    email: new UntypedFormControl(),
    excluded: new UntypedFormControl(false),
    prefer_email: new UntypedFormControl(true)
  });

  save() {
    this.changes.next(this.form.value);
  }
}
