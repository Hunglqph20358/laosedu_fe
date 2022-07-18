import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {

  transform(value: string, ...args: string[]): any {
    return moment(value).format(args.join(''));
  }
}
