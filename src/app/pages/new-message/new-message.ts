import { Component, computed } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import moment from "moment";

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
  templateUrl: "./new-message.html",
  styleUrl: "./new-message.scss",
})
export class NewMessagePage {
  newMessageForm = new FormGroup({
    messageTypeControl: new FormControl("", [Validators.required]),
    codeControl: new FormControl("", [Validators.required]),
    titleControl: new FormControl("", [Validators.required]),
    endCueControl: new FormControl("", [Validators.required]),
    expiryDateControl: new FormControl(
      moment().tz("Australia/Adelaide").format("YYYY-MM-DD"),
      [Validators.required],
    ),
    audioControl: new FormControl<File | null>(null, [Validators.required]),
    producerControl: new FormControl("", [Validators.required]),
  });

  messageTypes = computed(() => {
    return [{ id: 1, name: "test" }];
  });

  onSubmit() {}

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
