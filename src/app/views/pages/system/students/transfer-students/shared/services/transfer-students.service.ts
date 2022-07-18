import {Injectable} from '@angular/core';
import {TransferStudentStatus} from '../models/transfer-student-status';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {Select} from '../models/select';
import {GradeLevelModel} from '../../../../../../../core/service/model/grade-level.model';
import {catchError, filter, map, mergeMap, startWith, tap} from 'rxjs/operators';
import {GradeLevelService} from '../../../../../../../core/service/service-model/grade-level.service';
import {ClassroomService} from '../../../../../../../core/service/service-model/classroom.service';
import {BasicService} from '../../../../../../../core/service/utils/basic.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '../../../../../../../core/service/utils/helper.service';
import {environment} from '../../../../../../../../environments/environment';
import {TransferStudentPayload} from '../models/transfer-student-payload';
import {TransferStudent} from '../models/transfer-student';
import {SchoolYearPairs} from '../models/school-year-pairs';
import {SearchState} from '../models/search-state';

@Injectable({
  providedIn: 'root'
})
export class TransferStudentsService extends BasicService {

  private readonly defaultSelect: Select = {
    items: [],
    defaultValue: undefined
  };

  private readonly gradeSelectedSubject = new BehaviorSubject<GradeLevelModel>(undefined);
  private readonly gradeSelectedAction$ = this.gradeSelectedSubject.asObservable();
  className;

  transferStatuses$: Observable<TransferStudentStatus[]> = of([
    {
      id: null,
      name: this.translateService.instant('TRANSFER_STUDENTS.ALL'),
    },
    {
      id: 1,
      name: this.translateService.instant('TRANSFER_STUDENTS.BE_PROMOTED'),
    },
    {
      id: 0,
      name: this.translateService.instant('TRANSFER_STUDENTS.REPEAT_A_CLASS'),
    },
    {
      id: 2,
      name: this.translateService.instant('TRANSFER_STUDENTS.NOT_YET_TRANSFER'),
    }
  ]);

  schoolYears$ = this.classroomService.listYears$
    .pipe(
      filter(schoolYears => Boolean(schoolYears)),
      filter(schoolYears => schoolYears.length > 0),
      map(schoolYears => schoolYears.map(v => v.years))
    );

  currentSchoolYear$ = this.classroomService.yearCurrent$;

  schoolYearPairs$ = combineLatest([
    this.schoolYears$,
    this.currentSchoolYear$
  ]).pipe(
    map(([schoolYears, current]) => {
      const currentSchoolYearIndex = schoolYears.findIndex(schoolYear => schoolYear === current);
      const next = schoolYears[currentSchoolYearIndex - 1] || '';
      return {
        current,
        next
      } as SchoolYearPairs;
    })
  );

  grades$ = this.gradeLevelService.getGradeLevelOrderByName();

  gradeSelect$: Observable<Select> = this.grades$
    .pipe(
      tap((grades: GradeLevelModel[]) => {
        this.gradeSelectedSubject.next(grades[0]);
      }),
      map((grades: GradeLevelModel[]) => ({
        items: grades,
        defaultValue: grades[0]
      } as Select)),
      startWith(this.defaultSelect),
      catchError(() => {
        return of(this.defaultSelect);
      })
    );

  classSelect$ = combineLatest([
    this.currentSchoolYear$,
    this.gradeSelectedAction$
  ]).pipe(
    map(([currentSchoolYear, selectedGrade]) => ({currentSchoolYear, selectedGrade})),
    filter(payload => Boolean(payload.currentSchoolYear)),
    filter(payload => Boolean(payload.selectedGrade)),
    mergeMap((payload) => this.findByGradeLevelAndYear({
      years: payload.currentSchoolYear,
      gradeLevel: payload.selectedGrade.id
    })),
    map(response => response.data),
    map(items => ({
      items: items.map(item => ({
        ...item,
        fullName: `${item.code} - ${item.name}`
      })),
      defaultValue: items[0]
    }) as Select),
    startWith(this.defaultSelect),
    catchError(() => {
      return of(this.defaultSelect);
    })
  );

  transferStatusSelect$: Observable<Select> = this.transferStatuses$
    .pipe(
      map((statuses) => ({
        items: statuses,
        defaultValue: statuses[0]
      } as Select))
    );

  transferStatusItems$: Observable<TransferStudentStatus[]> = of([
    {
      id: 1,
      name: this.translateService.instant('TRANSFER_STUDENTS.BE_PROMOTED')
    },
    {
      id: 0,
      name: this.translateService.instant('TRANSFER_STUDENTS.REPEAT_A_CLASS')
    }
  ]);

  constructor(private translateService: TranslateService,
              private gradeLevelService: GradeLevelService,
              private classroomService: ClassroomService,
              public httpClient: HttpClient,
              public helperService: HelperService) {
    super(httpClient, helperService)
  }

  searchTransferStudents(state: SearchState) {
    return this.postRequest(`${environment.API_GATEWAY_ENDPOINT}transfer-students/search`, state.payload, {
      page: state.page,
      size: 10
    });
  }

  findByGradeLevelAndYear(payload) {
    return this.classroomService.findByGradeLevelAndYear(payload);
  }

  setSelectedGrade(value: GradeLevelModel) {
    this.gradeSelectedSubject.next(value);
  }

  export(payload: TransferStudentPayload) {
    return this.httpClient.post(`${environment.API_GATEWAY_ENDPOINT}transfer-students/export`,
      payload, {responseType: 'blob'});
  }

  transferStudent(transferStudent: TransferStudent[]): Observable<any> {
    return this.httpClient.post(`${environment.API_GATEWAY_ENDPOINT}transfer-students/transfer`, transferStudent);
  }

  getClassesFromCombineLatestWithAnAction(action$: Observable<GradeLevelModel>) {
    return combineLatest([
      this.schoolYearPairs$,
      action$,
    ]).pipe(
      map(([schoolYearPairs, selectedGrade]) => ({schoolYearPairs, selectedGrade})),
      filter(payload => Boolean(payload.schoolYearPairs.next)),
      filter(payload => Boolean(payload.selectedGrade)),
      mergeMap((payload) => this.findByGradeLevelAndYear({
        years: payload.schoolYearPairs.next,
        gradeLevel: payload.selectedGrade.id
      })),
      map(response => response.data || []),
      startWith([]),
      catchError(() => {
        return of([]);
      })
    );
  }

}
