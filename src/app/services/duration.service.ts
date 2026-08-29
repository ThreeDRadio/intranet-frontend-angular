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

  validate(input: string): boolean {
    // Exit early for special cases.
    // Make any field using this service optional.
    if (input === "00:00" || input === "0:00" || input === "") return true;

    const parsed = moment.duration(input).toISOString();

    if (input !== "P0D" && parsed === "P0D") {
      return false;
    }

    return true;
  }

  toReadableFromSeconds(input: number): string {
    const formatted = moment().startOf("day").seconds(input).format("m:ss");
    return formatted.toString();
  }
}
