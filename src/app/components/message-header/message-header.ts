import { Component, inject, input } from "@angular/core";
import { Message } from "../../models/message";
import { MatCardModule } from "@angular/material/card";
import { DateService } from "../../services/date.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-message-header",
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  providers: [DateService],
  templateUrl: "./message-header.html",
  styleUrl: "./message-header.scss",
})
export class MessageHeader {
  dateService = inject(DateService);

  message = input.required<Message>();
}
