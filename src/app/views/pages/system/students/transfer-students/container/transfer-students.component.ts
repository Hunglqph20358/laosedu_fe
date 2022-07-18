import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GradeLevelModel} from '../../../../../../core/service/model/grade-level.model';
import {TransferStudentsService} from '../shared/services/transfer-students.service';
import {filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {TransferStudentPayload} from '../shared/models/transfer-student-payload';
import {TransferStudent} from '../shared/models/transfer-student';
import {BehaviorSubject} from 'rxjs';
import {TransferStudentDialogComponent} from '../components/transfer-student-dialog/transfer-student-dialog.component';
import {TransferStudentUpdateDialogComponent} from '../components/transfer-student-update-dialog/transfer-student-update-dialog.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {download, exportName} from '../../../../../../helpers/utils';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, Validators} from '@angular/forms';
import {RowNode} from 'ag-grid-community/dist/lib/entities/rowNode';
import {Page} from '../shared/models/page';
import {SearchState} from '../shared/models/search-state';
import {ClassroomService} from '../../../../../../core/service/service-model/classroom.service';
import {SchoolYearModel} from '../../../school-year/school-year.model';
import {TransferStudentNotifyComponent} from '../components/transfer-student-notify/transfer-student-notify.component';
import {DeleteClassRoomComponent} from '../../../class-room/delete-class-room/delete-class-room.component';
import {MatDialog} from '@angular/material/dialog';
import {SchoolYearService} from '../../../school-year/school-year.service';

@Component({
  selector: 'kt-transfer-students',
  templateUrl: './transfer-students.component.html',
  styleUrls: ['./transfer-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferStudentsComponent implements OnInit{

  private readonly searchTransferStudentStateSubject = new BehaviorSubject<SearchState>(undefined);
  private readonly selectedStudentsSubject = new BehaviorSubject<RowNode[]>([]);
  private readonly exportButtonSubject = new BehaviorSubject<boolean>(false);

  isShowTransferButton$ = this.selectedStudentsSubject.asObservable().pipe(map(v => v.length > 0));

  isShowExportButton$ = this.exportButtonSubject.asObservable();

  currentSchoolYear$ = this.transferStudentsService.currentSchoolYear$;

  schoolYearPair$ = this.transferStudentsService.schoolYearPairs$;

  gradeSelect$ = this.transferStudentsService.gradeSelect$;

  classSelect$ = this.transferStudentsService.classSelect$;

  transferStatusSelect$ = this.transferStudentsService.transferStatusSelect$;

  transferStudentPayload$ = this.searchTransferStudentStateSubject.asObservable();

  schoolYear$ = this.schoolYearPair$;

  isView = false;
  yearNow2;

  isHaveSchoolYearAfter = true;

  transferStudentPages$ = this.transferStudentPayload$
    .pipe(
      filter(state => Boolean(state)),
      switchMap(state => this.transferStudentsService.searchTransferStudents(state)),
      map((value: Page<TransferStudent>) => {
        return {
          ...value,
          content: value.content.map((student, index) => {
            return {
              ...student,
              no: value.number * value.size + index + 1
            }
          })
        } as Page<TransferStudent>
      }),
      tap(page => {
        this.exportButtonSubject.next(page.totalElements > 0)
      }),
      startWith({
        content: [],
        totalElements: 0,
        number: 0,
        size: 0,
        totalPages: 0
      } as Page<TransferStudent>)
    );

  constructor(private transferStudentsService: TransferStudentsService,
              private modalService: BsModalService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private classroomService: ClassroomService,
              private schoolyearService: SchoolYearService,
              private fb: FormBuilder,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.checkSchoolYearAfter();
  }

  checkSchoolYearAfter() {
    this.schoolyearService.getListSchoolYearHeader().subscribe(
      obj => {

        const years = obj.yearCurrent.split('-');
        const nextYears: string = (+years[1]) + '-' + (+years[1] + 1);
        const schoolYearFind = obj.listSchoolYear.find(e => e.years === nextYears);

        if (!schoolYearFind) {
          this.searchTransferStudentStateSubject.next(undefined);
          this.isHaveSchoolYearAfter = false;

          const dataConfirm = {
            title: this.translateService.instant('PARENT_CONTACT.SEND_MAIL.TYPE_MESSAGE.NOTIFICATION'),
            message1: this.translateService.instant('TRANSFER_STUDENTS.YEAR_NEXT_MSG1'),
            message2: this.translateService.instant('TRANSFER_STUDENTS.YEAR_NEXT_MSG2'),
          }

          this.matDialog.open(TransferStudentNotifyComponent, {
            data: dataConfirm,
            disableClose: true,
            hasBackdrop: true,
            width: '420px'
          });
        }
      })
  }

  onGradeChange(selectedGrade: GradeLevelModel) {
    this.transferStudentsService.setSelectedGrade(selectedGrade);
  }

  onSearch(payload: TransferStudentPayload) {
    this.selectedStudentsSubject.next([]);
    this.searchTransferStudentStateSubject.next({payload, page: 0});
  }

  onPageChanged(page: number) {
    this.selectedStudentsSubject.next([]);
    this.setPageChanged(page);
  }

  setPageChanged(page: number) {
    this.searchTransferStudentStateSubject.next({
      ...this.searchTransferStudentStateSubject.value,
      page
    });
  }

  onTransferStudentsSelected(transferStudents: RowNode[]) {
    this.selectedStudentsSubject.next(transferStudents);
  }

  onTransferClicked() {
    const selectedStudents = this.selectedStudentsSubject.value.map(row => row.data);
    console.log(selectedStudents);
    if (this.invalid(selectedStudents)) {
      return;
    }

    this.modalService.show(TransferStudentDialogComponent, {
      initialState: {
        selectedStudents,
        form: this.fb.group({
          ...this.getControlsConfig(),
          status: [
            undefined,
            [Validators.required]
          ],
        }),
        afterTransfer: () => {
          this.setPageChanged(0);
          this.onUncheckClicked();
          this.isShowTransferButton$.subscribe(res=>{
            console.log(res)
          });
        }
      },
      class: 'modal-dialog-centered'
    });
  }

  getControlsConfig() {
    return {
      currentSchoolYear: undefined,
      nextSchoolYear: undefined,
      gradeLevel: [
        undefined,
        [Validators.required]
      ],
      classCode: [
        undefined,
        [Validators.required]
      ]
    };
  }

  private invalid(selectedStudents: TransferStudent[]) {
    // tslint:disable-next-line:max-line-length
    const errors = selectedStudents.filter(d => d.details.status !== null || d.assessDetails.id == null || (d.assess.semester === '0' && (d.assessDetails.competitionTitle === null || d.assessDetails.competitionTitle === ''))).reduce((acc, d) => {
      if (acc.status && acc.access) {
        acc.both = true;
      }

      if (!acc.status) {
        if (d.details.status !== null) {
          acc.status = true;
        }
      }

      if (!acc.access) {
        if (d.assessDetails.id === null) {
          acc.access = true;
        }else if(d.assessDetails.competitionTitle === ''){
          acc.access = true;
        }
      }

      return acc;
    }, {
      both: false,
      access: false,
      status: false
    });

    const title = this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE');
    let yearNext = '';
    this.schoolYear$.subscribe(res=>{
      yearNext = res.next;
    })
    const options = {
      timeOut: 5000
    };

    if(yearNext === null || yearNext === ''){
      // tslint:disable-next-line:max-line-length
      // this.toastrService.error('Năm học tới chưa được cấu hình, vui lòng cấu hình năm học liền kề tới trước khi thực hiện chức năng Kết chuyển học sinh', title, options);
      // tslint:disable-next-line:max-line-length
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE') + ' (' + this.translateService.instant('TRANSFER_STUDENTS.YEAR_NEXT_MSG') + ')');
      return true;
    }
    if(errors.access && errors.status){
      // tslint:disable-next-line:max-line-length
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE') + ' (' + this.translateService.instant('TRANSFER_STUDENTS.BOTH_NO_ACCESS_AND_ALREADY_TRANSFER_MSG') + ')');
      return true;
    }
    if (errors.both) {
      // tslint:disable-next-line:max-line-length
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE') + ' (' + this.translateService.instant('TRANSFER_STUDENTS.BOTH_NO_ACCESS_AND_ALREADY_TRANSFER_MSG') + ')');
      return true;
    }

    if (errors.status) {
      // tslint:disable-next-line:max-line-length
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE') + ' (' + this.translateService.instant('TRANSFER_STUDENTS.ALREADY_TRANSFER_MSG') + ')');
      return true;
    }

    if (errors.access) {
      // tslint:disable-next-line:max-line-length
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE') + ' (' + this.translateService.instant('TRANSFER_STUDENTS.NO_ACCESS_MSG') + ')');
      return true;
    }

    return false;
  }

  onEditClicked(transferStudent: TransferStudent) {
    this.modalService.show(TransferStudentUpdateDialogComponent, {
      initialState: {
        transferStudent,
        form: this.fb.group({
          ...this.getControlsConfig(),
          status: [
            {id: transferStudent.details.status},
            [Validators.required]
          ],
          gradeLevel: [
            {id: transferStudent.details.newGradeLevel},
            [Validators.required]
          ],
          classCode: [
            {code: transferStudent.details.newClassCode},
            [Validators.required]
          ],
        }),
        afterUpdate: () => {
          this.setPageChanged(0);
        }
      },
      class: 'modal-dialog-centered'
    });
  }

  onExportClicked() {
    this.classroomService.getByCode(this.searchTransferStudentStateSubject.value.payload.classCode).subscribe(res=>{
      // tslint:disable-next-line:max-line-length
      const nameFile = this.translateService.instant('TRANSFER_STUDENTS.FILE_NAME') + res.name + '_' + this.searchTransferStudentStateSubject.value.payload.schoolYear;
      this.transferStudentsService.export(this.searchTransferStudentStateSubject.value.payload)
        .subscribe(
          (bytes) => {
            if (bytes)
              download(bytes, nameFile);
          },
          error => {
            console.log(error);
          }
        );
    })
  }

  onUncheckClicked() {
    this.selectedStudentsSubject.value.forEach(node => {
      node.setSelected(false);
    });
  }

}
