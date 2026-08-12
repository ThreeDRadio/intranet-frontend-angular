import moment from "moment";

export class DurationService {
  isValidDuration(input: string): boolean {
    if (input !== "P0D" && moment.duration(input).toISOString() === "P0D") {
      return false;
    }

    return true;
  }
}
