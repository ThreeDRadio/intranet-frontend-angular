import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Supporter } from 'app/supporters/models/supporter';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  form = new FormGroup({
    first_name: new FormControl(),
    last_name: new FormControl('', Validators.required),
    address1: new FormControl('', Validators.required),
    address2: new FormControl(),
    town: new FormControl('', Validators.required),
    state: new FormControl('SA', Validators.required),
    postcode: new FormControl('', Validators.required),
    country: new FormControl('Australia'),
    phone_mobile: new FormControl(),
    phone_home: new FormControl(),
    phone_work: new FormControl(),
    gender: new FormControl(),
    dob: new FormControl(),
    email: new FormControl(),
    excluded: new FormControl(false),
    prefer_email: new FormControl(true)
  });

  save() {
    this.changes.next(this.form.value);
  }
}
