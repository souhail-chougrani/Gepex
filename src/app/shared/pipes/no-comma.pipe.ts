import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noComma'
})
export class NoCommaPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === undefined || value === null) {
      return value;
    }
    return value.toString().replace(',', ' ');
  }
}
