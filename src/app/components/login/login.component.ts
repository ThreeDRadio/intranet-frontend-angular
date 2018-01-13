import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'nf-login-form',
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['login.component.scss']
})
export class LoginFormComponent {
  protected _disabled = false;
  protected _loading = false;
  email = new FormControl('', Validators.compose([Validators.required]));
  password = new FormControl('', Validators.required);

  form: FormGroup;

  @Input()
  set disabled(val: boolean) {
    this._disabled = val;
    if (this._disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
  get disabled() {
    return this._disabled;
  }
  @Input()
  set loading(val: boolean) {
    this._loading = val;
    if (this._loading && !this.form.disabled) {
      this.form.disable();
    } else if (!this._loading && !this._disabled && this.form.disabled) {
      this.form.enable();
    }
  }
  get loading() {
    return this._loading;
  }
  @Input() error: string;
  @Output() login = new EventEmitter();
  constructor(public fb: FormBuilder) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({ email: this.email, password: this.password });
  }
  submit(form: { email: string; password: string }) {
    if (this.form.invalid) return false;
    if (this.loading) return false;
    if (this.disabled) return false;
    this.login.emit(form);
    return false;
  }
}
