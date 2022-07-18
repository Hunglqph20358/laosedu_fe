import {Pipe, PipeTransform} from '@angular/core';

const defaultLimit = 50;

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    const limit = args.length > 0 ? parseInt(args[0], 10) : defaultLimit;
    const trail = args.length > 1 ? args[1] : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
