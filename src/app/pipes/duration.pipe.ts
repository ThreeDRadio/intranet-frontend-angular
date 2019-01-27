import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  pure: true
})
export class DurationPipe implements PipeTransform {
  transform(value) {
    if (typeof value === 'number') {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      if (seconds === 0) {
        return `${minutes}:00`;
      }
      if (seconds < 10) {
        return `${minutes}:0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    }
    return value;
  }
}
