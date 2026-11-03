import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SortService {
  isValid(input: string, columns: string[]): boolean {
    let cleanedInput = input;

    if (cleanedInput.startsWith("-")) {
      cleanedInput = cleanedInput.slice(1);
    }

    return columns.includes(cleanedInput);
  }

  getDirection(input: string): "asc" | "desc" {
    if (input.startsWith("-")) {
      return "desc";
    }

    return "asc";
  }

  getColumnId(input: string): string {
    return input.startsWith("-") ? input.slice(1) : input;
  }
}
