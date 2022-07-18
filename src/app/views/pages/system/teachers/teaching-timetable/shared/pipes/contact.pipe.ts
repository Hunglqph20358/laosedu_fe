import {Pipe, PipeTransform} from '@angular/core';

const contacts = {
  0: 'TEACHING_TIMETABLE.OFF_PAY_CONTACT',
  1: 'TEACHING_TIMETABLE.PAYROLL_CONTACT',
  default: 'TEACHING_TIMETABLE.UNKNOWN'
}

@Pipe({
  name: 'contact',
})
export class ContactPipe implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    return contacts[value] || contacts.default;
  }
}
