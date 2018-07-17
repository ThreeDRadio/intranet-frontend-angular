import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  pure: true,
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number, fraction: number) {
    if (typeof value !== 'number') {
      return value;
    }
    return value.toFixed(fraction);
  }
}
