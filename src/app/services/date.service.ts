import moment from "moment";

export class DateService {
  getDisplayDate(input: string): string {
    if (input === undefined || input === null) return "";
    return moment(input).format("dddd, MMMM Do YYYY");
  }
  getApiFormat(input: Date) {
    console.log(input.getFullYear());
  }
}
