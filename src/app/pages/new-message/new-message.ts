import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DATE_FORMATS, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import moment from "moment";
import { LONG_DATE_FORMAT } from "../../constants";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-new-message",
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonToggleModule,
  ],
  providers: [
    UserService,
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: LONG_DATE_FORMAT },
  ],
  templateUrl: "./new-message.html",
  styleUrl: "./new-message.scss",
})
export class NewMessagePage {
  private userService = inject(UserService);

  // Forms
  newMessageForm = new FormGroup({
    messageTypeControl: new FormControl("", [Validators.required]),
    codeControl: new FormControl("", [Validators.required]),
    titleControl: new FormControl("", [Validators.required]),
    endCueControl: new FormControl("", [Validators.required]),
    expiryDateControl: new FormControl("", [Validators.required]),
    audioControl: new FormControl<File | null>(null, [Validators.required]),
    producerControl: new FormControl("", [Validators.required]),
  });

  readonly messageTypes = computed(() => {
    return [{ id: 1, name: "test" }];
  });

  constructor() {
    effect(() => {
      const user = this.userService.getLoggedInUser();
      if (user?.username) {
        this.newMessageForm.controls.producerControl.setValue(user.username);
      }
    });
  }

  onSubmit() {
    const user = this.userService.getLoggedInUser();

    if (this.newMessageForm.valid) {
      // Reset the Angular form controls & validation state
      // Keep the previous producer in case they would like to do multiple message uploads.
      const producer =
        this.newMessageForm.controls.producerControl.getRawValue();
      this.newMessageForm.reset();
      this.newMessageForm.controls.audioControl.setValue(null);
      this.newMessageForm.controls.producerControl.setValue(producer);
    }
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.newMessageForm.get("audioControl");

    if (input.files && input.files.length > 0) {
      control?.setValue(input.files[0]);
    }
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  clearAudio(event: Event, fileInput: HTMLInputElement): void {
    event.stopPropagation();
    const control = this.newMessageForm.get("audioControl");
    control?.setValue(null);
    control?.markAsTouched();
    control?.updateValueAndValidity();
    fileInput.value = "";
  }
}
