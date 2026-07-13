import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: "app-nf-login-form",
  imports: [MatFormField, MatProgressBar, ReactiveFormsModule],
  templateUrl: "login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["login.component.scss"],
})
export class LoginFormComponent {
  protected _disabled = false;
  protected _loading = false;
  username = new UntypedFormControl(
    "",
    Validators.compose([Validators.required]),
  );
  password = new UntypedFormControl("", Validators.required);

  form: UntypedFormGroup;

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
  constructor(public fb: UntypedFormBuilder) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({ username: this.username, password: this.password });
  }
  submit(form: { username: string; password: string }) {
    if (this.form.invalid) return false;
    if (this.loading) return false;
    if (this.disabled) return false;
    this.login.emit(form);
    return false;
  }
}
