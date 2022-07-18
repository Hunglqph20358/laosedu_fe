import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TransferStudent} from '../../shared/models/transfer-student';
import {TransferStudentsService} from '../../shared/services/transfer-students.service';
import {GradeLevelModel} from '../../../../../../../core/service/model/grade-level.model';
import {getField} from '../../../../../../../helpers/utils';

@Component({
  selector: 'kt-transfer-student-dialog',
  templateUrl: './transfer-student-dialog.component.html',
  styleUrls: ['./transfer-student-dialog.component.scss']
})
export class TransferStudentDialogComponent {

  selectedStudents: TransferStudent[];
  afterTransfer: () => void;

  private readonly gradeSelectedSubject = new BehaviorSubject<GradeLevelModel>(undefined);
  private readonly gradeSelectedAction$ = this.gradeSelectedSubject.asObservable();

  schoolYearPairs$ = this.transferStudentsService.schoolYearPairs$
    .pipe(
      tap(schoolYearPairs => {
        this.form.patchValue({
          currentSchoolYear: schoolYearPairs.current,
          nextSchoolYear: schoolYearPairs.next
        });
      })
    );

  transferStatusItems$ = this.transferStudentsService.transferStatusItems$
    .pipe(
      tap(items => {
        this.form.patchValue({status: items[0]})
      })
    );

  grades$ = this.transferStudentsService.grades$
    .pipe(
      tap((grades: GradeLevelModel[]) => {
        const value = grades[0];
        this.gradeSelectedSubject.next(value);
        this.form.patchValue({gradeLevel: value})
      }),
      startWith([]),
      catchError(() => {
        return of([]);
      })
    );

  classes$ = this.transferStudentsService.getClassesFromCombineLatestWithAnAction(this.gradeSelectedAction$)
    .pipe(
      tap((classes) => {
        this.form.patchValue({classCode: classes[0]})
      })
    );

  vm$ = combineLatest([
    this.schoolYearPairs$,
    this.transferStatusItems$,
    this.grades$,
    this.classes$
  ]).pipe(
    map(([schoolYearPairs, transferStatusItems, grades, classes]) => {
      return {
        schoolYearPairs,
        transferStatusItems,
        grades,
        classes
      }
    }),
  );

  form: FormGroup;

  get gradeLevel() {
    return this.form.get('gradeLevel');
  }

  get classCode() {
    return this.form.get('classCode');
  }

  get status() {
    return this.form.get('status');
  }

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef,
              private translateService: TranslateService,
              private transferStudentsService: TransferStudentsService,
              private toastr: ToastrService) {
  }

  isStatusEqual(a, b) {
    return a.id === b.id;
  }

  isGradeEqual(a, b) {
    return a.id === b.id;
  }

  isClassEqual(a, b) {
    return a.id === b.id;
  }

  onCancel() {
    this.bsModalRef.hide();
  }

  onOk() {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value;

    const payload = {
      currentSchoolYear: value.currentSchoolYear,
      nextSchoolYear: value.nextSchoolYear,
      gradeLevel: getField(value.gradeLevel, 'id'),
      classCode: getField(value.classCode, 'code'),
      status: getField(value.status, 'id'),
    }

    const transferStudents = this.selectedStudents.map(transferStudent => ({
      ...transferStudent,
      details: {
        ...transferStudent.details,
        currentSchoolYear: transferStudent.schoolYear,
        currentClassCode: transferStudent.classCode,
        academicAbility: transferStudent.assessDetails.academicAbility,
        conduct: transferStudent.assessDetails.conduct,
        status: payload.status,
        newClassCode: payload.classCode,
        newSchoolYear: payload.nextSchoolYear,
        newGradeLevel: payload.gradeLevel
      }
    }))

    this.transferStudentsService.transferStudent(transferStudents)
      .subscribe(() => {
        this.toastr.success(this.translateService.instant('TRANSFER_STUDENTS.TRANSFER_SUCCESS'));
        this.bsModalRef.hide();
        this.afterTransfer();
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  onGradeChanged(grade) {
    this.gradeSelectedSubject.next(grade);
  }
}
