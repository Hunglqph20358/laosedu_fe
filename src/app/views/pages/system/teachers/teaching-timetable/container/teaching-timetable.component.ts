import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TeachingTimetableService} from '../shared/services/teaching-timetable.service';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, EMPTY} from 'rxjs';
import {TeachingSchedulePayload} from '../shared/models/teaching-schedule-payload';
import * as moment from 'moment';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'kt-teaching-timetable',
  templateUrl: './teaching-timetable.component.html',
  styleUrls: ['./teaching-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachingTimetableComponent {

  private readonly teachingScheduleFilteredSubject = new BehaviorSubject<TeachingSchedulePayload>(undefined);

  teacher$ = this.teachingTimetableService.getLoggedInTeacher();
  currentSchoolYear$ = this.teachingTimetableService.currentSchoolYear$.pipe(filter(d => Boolean(d)));
  semesterSelect$ = this.teachingTimetableService.semesterSelect$;
  isRole: number;
  currentRoles;
  ADMIN = `${environment.ROLE.ADMIN}`;
  vm$ = combineLatest([
    this.currentSchoolYear$,
    this.teacher$,
    this.semesterSelect$,
  ]).pipe(
    map(([currentSchoolYear, teacher, semesterSelect]) => ({
      teacher,
      data: {
        schoolYear: currentSchoolYear,
        teacherCode: teacher.code,
        semesterSelect,
        applyDate: moment().format('YYYY-MM-DD')
      }
    })),
  );

  teachingSchedule$ = this.teachingScheduleFilteredSubject
    .pipe(
      filter(payload => {
        return Boolean(payload)
      }),
      mergeMap(payload => {
        return this.teachingTimetableService.searchTeachingSchedule(payload)
      }),
      catchError(error => {
        return EMPTY;
      })
    );

  constructor(private teachingTimetableService: TeachingTimetableService) {
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      this.currentRoles.forEach(e => {
        if (e === this.ADMIN) {
          this.isRole = 1;
          return;
        }
      })
      // Check role khác admin
      if(this.isRole === 1){
        this.currentRoles.forEach(e => {
          if (e !== this.ADMIN) {
            this.isRole = 0;
          }
        })
      }
    }
    console.log(this.isRole);
  }

  onFilter(payload: TeachingSchedulePayload) {
    this.teachingScheduleFilteredSubject.next(payload);
  }
}
