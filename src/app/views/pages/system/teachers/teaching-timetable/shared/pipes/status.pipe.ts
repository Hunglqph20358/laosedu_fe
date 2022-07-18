import {Pipe, PipeTransform} from '@angular/core';

const statuses = {
  0: 'TEACHING_TIMETABLE.WORKING_STATUS',
  1: 'TEACHING_TIMETABLE.RETIRED_STATUS',
  2: 'TEACHING_TIMETABLE.OFF_STATUS',
  default: 'TEACHING_TIMETABLE.UNKNOWN'
};

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return statuses[value] || statuses.default;
  }
}
