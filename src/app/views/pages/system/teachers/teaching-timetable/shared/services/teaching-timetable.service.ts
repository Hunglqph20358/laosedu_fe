import {Injectable} from '@angular/core';
import {environment} from '../../../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Teacher} from '../../../../../../../core/service/model/teacher.model';
import {MappedSchedules} from '../models/mapped-schedules';
import {Schedules} from '../models/schedules';
import {HttpClient} from '@angular/common/http';
import {ClassroomService} from '../../../../../../../core/service/service-model/classroom.service';
import {StudentsService} from '../../../../../../../core/service/service-model/students.service';
import {Select} from '../../../../students/transfer-students/shared/models/select';
import {TeachingSchedulePayload} from '../models/teaching-schedule-payload';
import {TeachingSchedule} from '../models/teaching-schedule';

@Injectable({
  providedIn: 'root'
})
export class TeachingTimetableService {

  private readonly baseApiUrl = environment.API_GATEWAY_ENDPOINT;
  loggedInTeacher$ = this.httpService.get<{ data }>(`${this.baseApiUrl}teacher/login-teacher-info`)
    .pipe(
      map(response => response.data as Teacher),
    );

  currentSchoolYear$ = this.classroomService.yearCurrent$;
  semesterSelect$ = this.studentsService.getAllSemester()
    .pipe(
      map(data => {
        return {
          items: data.semesterList,
          defaultValue: data.semesterCurrent,
          isBetween: data.isBetween
        } as Select
      })
    );

  constructor(private httpService: HttpClient,
              private classroomService: ClassroomService,
              private studentsService: StudentsService) {
  }

  getLoggedInTeacher() {
    return this.loggedInTeacher$;
  }

  searchTeachingSchedule(payload: TeachingSchedulePayload) {
    return this.httpService.post<TeachingSchedule>(`${this.baseApiUrl}schedule/teaching/search`, payload)
      .pipe(
        map(teachingSchedule => {
          return {
            ...teachingSchedule,
            mappedSchedules: this.createMappedSchedules(teachingSchedule.schedules)
          } as TeachingSchedule;
        })
      );
  }

  private createMappedSchedules(schedules: Schedules) {
    return Object.keys(schedules).reduce((mappedSchedules, key) => {
      const scheduleValues = schedules[key];

      mappedSchedules[key] = scheduleValues.reduce((accumulator, schedule) => {
        accumulator[schedule.dayCode + schedule.lessonCode] = schedule;
        return accumulator;
      }, {});

      return mappedSchedules;
    }, {} as MappedSchedules);
  }
}
