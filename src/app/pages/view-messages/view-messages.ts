import { Component, inject } from "@angular/core";
import { MessageBankService } from "../../services/message-bank.service";
import { MessageBankStore } from "../../store/message-bank.store";
import { MessageHeader } from "../../components/message-header/message-header";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-view-messages",
  imports: [
    MessageHeader,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: "./view-messages.html",
  styleUrl: "./view-messages.scss",
})
export class ViewMessagesPage {
  messageBankStore = inject(MessageBankStore);
  messageBankService = inject(MessageBankService);
}
