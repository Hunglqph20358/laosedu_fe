import {Day} from './day';
import {Lesson} from './lesson';
import {Schedules} from './schedules';
import {MappedSchedules} from './mapped-schedules';

export interface TeachingSchedule {
  days: Day[];
  lessons: Lesson[];
  dates: string[];
  schedules: Schedules;
  mappedSchedules: MappedSchedules;
}
