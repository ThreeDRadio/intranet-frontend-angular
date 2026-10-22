import { Component, inject, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Release } from "../../models/release";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-new-comment-input",
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./new-comment-input.html",
  styleUrl: "./new-comment-input.scss",
})
export class NewCommentInputComponent {
  private userService = inject(UserService);
  input = input.required<Release>();
  user = input.required();
}
