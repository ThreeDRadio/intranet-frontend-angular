import moment from "moment";

export class DurationService {
  parse(input: string) {
    if (input === null || input === undefined || input === "") {
      return "00:00:00";
    }

    const parts = input.split(":");
    if (parts.length === 3) {
      const values = moment({
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10),
        seconds: parseInt(parts[2], 10),
      });
      return values.format("HH:mm:ss");
    }
    if (parts.length === 2) {
      const values = moment({
        minutes: parseInt(parts[0], 10),
        seconds: parseInt(parts[1], 10),
      });
      return values.format("HH:mm:ss");
    }
    if (parts.length <= 1) {
      const values = moment({
        seconds: parseInt(parts[0], 10),
      });
      return values.format("HH:mm:ss");
    }

    return "00:00:00";
  }

  isValidDuration(input: string): boolean {
    if (input !== "P0D" && moment.duration(input).toISOString() === "P0D") {
      return false;
    }

    return true;
  }
}
