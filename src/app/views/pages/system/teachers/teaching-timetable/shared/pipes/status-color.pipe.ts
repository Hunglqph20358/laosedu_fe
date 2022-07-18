import {Pipe, PipeTransform} from '@angular/core';

const colors = {
  0: '#52BD94',
  1: '#D14343',
  2: '#474D66',
  3: '#F26522',
}

@Pipe({
  name: 'statusColor',
})
export class StatusColorPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return colors[value] || colors[0];
  }
}
