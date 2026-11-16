import moment from "moment";

export class DateService {
  private timezone = "Australia/Adelaide";

  getDisplayDate(input: string): string {
    if (input === undefined || input === null) return "";
    return moment(input).tz(this.timezone).format("dddd, MMMM Do YYYY");
  }

  getApiFormat(input) {
    return moment(input).tz(this.timezone).format("YYYY-MM-DD");
  }
}
