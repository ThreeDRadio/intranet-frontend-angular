import { Component, computed, inject } from "@angular/core";
import { MessageBankService } from "../../services/message-bank.service";
import { MessageBankStore } from "../../store/message-bank.store";
import { MessageHeader } from "../../components/message-header/message-header";

@Component({
  selector: "app-view-messages",
  imports: [MessageHeader],
  templateUrl: "./view-messages.html",
  styleUrl: "./view-messages.scss",
})
export class ViewMessagesPage {
  messageBankStore = inject(MessageBankStore);
  messageBankService = inject(MessageBankService);
}
