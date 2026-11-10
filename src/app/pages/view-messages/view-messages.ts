import { Component, inject } from "@angular/core";
import { MessageBankService } from "../../services/message-bank.service";
import { MessageBankStore } from "../../store/message-bank.store";

@Component({
  selector: "app-view-messages",
  imports: [],
  templateUrl: "./view-messages.html",
  styleUrl: "./view-messages.scss",
})
export class ViewMessagesPage {
  messageBankStore = inject(MessageBankStore);
  messageBankService = inject(MessageBankService);
}
