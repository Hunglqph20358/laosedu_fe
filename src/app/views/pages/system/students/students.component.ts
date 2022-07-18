import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { GradeLevelModel } from 'src/app/core/service/model/grade-level.model';
import { ClassroomService } from 'src/app/core/service/service-model/classroom.service';
import { GradeLevelService } from 'src/app/core/service/service-model/grade-level.service';
import { StudentsService } from 'src/app/core/service/service-model/students.service';
import { ActionStudentComponent } from './action-student/action-student.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportFileStudentComponent } from './import-file/import-file-student.component';
import { calculateFistLastPageTable, convertDateToString, download, exportName, next, pagination, prev, removeEmptyQuery } from 'src/app/helpers/utils';
import { NO_ROW_GRID_TEMPLATE,PAGE_SIZE, TABLE_CELL_STYLE, STUDENTS, ROLES_STUDENT_MANAGEMENT, ROLES_STUDENT_MANAGEMENT_FULL } from 'src/app/helpers/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SchoolYearService } from '../school-year/school-year.service';
import { TranslateService } from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'kt-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})

export class StudentsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  @ViewChild('newUnit') public newUnit: ModalDirective;
  @ViewChild('importUnit') public importUnit: ModalDirective;
  @ViewChild('importSubject') public importSubjects: ModalDirective;
  modalRef: BsModalRef;

  overlayLoadingTemplate
  overlayNoRowTemplate
  columnDefs;
  rowData = [];
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  totalPage
  context

  searchModel = {
    gradeLevel: null,
    classRoomCode: null,
    fullName: '',
    status: null,
    years: null
  }

  currentPage = 1;
  total = 0;
  first = 0;
  last = 0;
  rangeWithDots: number[];

  currentYearOnMainScreen: any;
  currentYear
  editable

  listGradeLevel: GradeLevelModel[];
  listClass = [];
  listStatus

  currentRoles = [];
  isRole = false;

  // Data classroom transfer
  dataFromClassroom = null;
  isLoading

  constructor(
    private modalService: BsModalService,
    private gradeLevelService: GradeLevelService,
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService: ClassroomService,
    private studentService: StudentsService,
    private matDialog: MatDialog,
    private schoolYearService: SchoolYearService,
    public router: Router,
    private location: Location,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translateList([{
      value: this.listStatus = [], data: STUDENTS.STATUS
    }])
    this.editable = true
    this.overlayNoRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'))
    TABLE_CELL_STYLE.display = 'block'

    this.context = {
      componentParent: this
    }

    this.columnDefs = [
      {
        headerName: this.tran('STUDENT.INFO.NO'),
        suppressMovable: true,
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * PAGE_SIZE) + 1)
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840', 'margin-left': '5px' }
      },
      {
        headerName: this.tran('STUDENT.INFO.CODE'),
        suppressMovable: true,
        tooltipField: 'code',
        field: 'code',
        minWidth: 126,
        cellStyle: { ...TABLE_CELL_STYLE, color: '#3366FF' }
      },
      {
        headerName: this.tran('STUDENT.INFO.FULL_NAME'),
        suppressMovable: true,
        tooltipField: 'fullName',
        field: 'fullName',
        minWidth: 180,
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840' }
      },
      {
        headerName: this.tran('STUDENT.INFO.DOB'),
        suppressMovable: true,
        tooltipField: 'birthDay',
        minWidth: 100,
        valueGetter: param => {
          return convertDateToString(param.data.birthDay)
        },
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840' }
      },
      {
        headerName: this.tran('STUDENT.INFO.SEX.TEXT'),
        suppressMovable: true,
        minWidth: 100,
        tooltipValueGetter: param => {
          return param.data == null ? '' : param.data.sex === 0 ? this.tran('STUDENT.INFO.SEX.MALE') : this.tran('STUDENT.INFO.SEX.FEMALE')
        },
        valueGetter: param => {
          return param.data == null ? '' : param.data.sex === 0 ? this.tran('STUDENT.INFO.SEX.MALE') : this.tran('STUDENT.INFO.SEX.FEMALE')
        },
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840' }
      },
      {
        headerName: this.tran('STUDENT.INFO.CLASS_NAME'),
        suppressMovable: true,
        tooltipField: 'className',
        field: 'className',
        minWidth: 100,
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840' }
      },
      {
        headerName: this.tran('STUDENT.INFO.DEPT_NAME'),
        suppressMovable: true,
        tooltipField: 'deptName',
        field: 'deptName',
        minWidth: 150,
        cellStyle: { ...TABLE_CELL_STYLE, color: '#101840' }
      },
      {
        headerName: this.tran('STUDENT.INFO.STATUS.TEXT'),
        suppressMovable: true,
        minWidth: 140,
        tooltipValueGetter: param => {
          const {name} = this.listStatus[param.data.status]
          return name
        },
        valueGetter: param => {
          const {name} = this.listStatus[param.data.status]
          return name
        },
        cellStyle: param => {
          const { color } = this.listStatus[param.data.status]
          return {
            ...TABLE_CELL_STYLE,
            color
          }

        }
      },
      {
        headerName: this.tran('STUDENT.INFO.PROFILE'),
        suppressMovable: true,
        minWidth: 130,
        cellRenderer: param => {
          return `<a style='color: #3366FF' href='/laosedu/#/system/student/student-profile/${param.data.id}/${this.currentYearOnMainScreen}'>${this.tran('STUDENT.SHOW_PROFILE')}</a>`
        },
        cellStyle: { ...TABLE_CELL_STYLE, color: '#3366FF' }
      },
      {
        headerName: '',
        suppressMovable: true,
        field: '',
        cellRendererFramework: ActionStudentComponent,
        minWidth: 50,
        maxWidth: 50,
      },
    ];

    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      if (this.currentRoles.some(element => ROLES_STUDENT_MANAGEMENT_FULL.includes(element))) {
        this.isRole = false;
        return;
      }
      this.isRole = this.currentRoles.some(element => ROLES_STUDENT_MANAGEMENT.includes(element));
      if (this.isRole) this.columnDefs = this.columnDefs.splice(0, this.columnDefs.length - 1);
    }

  }

  doSearch(page): void {
    this.isLoading = true
    this.currentPage = page
    removeEmptyQuery(this.searchModel);

    const search = {
      data: {
        ...this.searchModel,
        gradeId: this.searchModel.gradeLevel,
        years: this.currentYearOnMainScreen
      },
      page,
      pageSize: PAGE_SIZE
    }

    this.studentService.doSearch(search).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.isLoading = false
        if (res.status == 'OK') {
          this.rowData = res.data.students;
          this.total = res.data.total;

          this.first = 0
          this.last = 0
          this.rangeWithDots = []
          this.totalPage = 0

          if (this.total > 0) {
            this.totalPage = Math.ceil(this.total / PAGE_SIZE);
            this.rangeWithDots = pagination(this.currentPage, this.totalPage);
            this.first = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).first;
            this.last = calculateFistLastPageTable(this.rowData, this.total, PAGE_SIZE, this.currentPage).last;
          }
          this.changeDetectorRef.detectChanges();
        }
      },
      error: res => {
        console.log(res)
      }
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  ngOnInit(): void {
    setTimeout(this.removeStyle,2000);
    this.schoolYearService.getYear().subscribe({
      next: resp => {
        this.currentYear = resp.years
        this.editable = this.currentYear == this.currentYearOnMainScreen
      },
      error: resp => {
        console.log(resp)
      }
    })
    this.checkDataFromClass();
  }

  checkDataFromClass() {
    this.dataFromClassroom = this.location.getState();
    if (this.dataFromClassroom.id !== null && this.dataFromClassroom.id !== undefined) {
      this.gradeLevelService.getGradeLevelOfSubject().pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: res => {
          this.listGradeLevel = res;
          this.searchModel.gradeLevel = this.dataFromClassroom.gradeLevel;
          this.searchModel.classRoomCode = this.dataFromClassroom.code;
          this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(years => {
            this.currentYearOnMainScreen = years;
            const dataGetClass = { gradeLevel: this.searchModel.gradeLevel, years: this.currentYearOnMainScreen};
            this.classRoomService.findByGradeLevelAndYear(dataGetClass)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: resClass => {
                  this.doSearch(1)
                  if (resClass.status !== 'OK') {
                    return
                  }

                  this.listClass = resClass.data.map(value => {
                    value.name = `${value.code}-${value.name}`
                    return value
                  })
                },
                error: resClass => {
                  console.log(resClass)
                }
              })
          })
        },
        error: res => {
          console.log(res);
        }
      });
    } else {
      this.loadGradeLevel();
    }
  }

  openModalNewUnit() {
    this.newUnit.show();
  }

  openModalImportUnit() {
    this.importUnit.show();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  loadGradeLevel(data?): void {
    this.gradeLevelService.getGradeLevelOfSubject().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: res => {
        this.listGradeLevel = res;
        this.searchModel.gradeLevel = data ? data.id : res[0].id;

        this.classRoomService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(year => {
          this.currentYearOnMainScreen = year;
          this.editable = this.currentYear == this.currentYearOnMainScreen
          this.loadClassRoom();
        })
      },
      error: res => {
        console.log(res);
      }
    })
  }

  loadClassRoom(): void {
    this.classRoomService.findByGradeLevelAndYear({ gradeLevel: this.searchModel.gradeLevel, years: this.currentYearOnMainScreen })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: res => {
          this.doSearch(1)
          if (res.status !== 'OK') {
            return
          }
          this.searchModel.classRoomCode = null

          this.listClass = res.data.map(value => {
            value.name = `${value.code}-${value.name}`
            return value
          })
        },
        error: res => {
          console.log(res)
        }
      })
  }

  gridSizeChanged(params): void {
    params.api.sizeColumnsToFit();
    this.removeStyle();
  }

  // paging
  page(page: number): void {
    this.currentPage = page;
    this.doSearch(this.currentPage)
  }

  prev(): void {
    this.currentPage--
    if (this.currentPage < 1) {
      this.currentPage = 1
      return
    }
    this.page(this.currentPage);
  }

  next(): void {
    this.currentPage++
    if (this.currentPage > this.totalPage) {
      this.currentPage = this.totalPage
      return
    }

    this.page(this.currentPage);
  }

  openImportDialog() {
    const dataImport: any = {};
    dataImport.years = 2000;
    this.matDialog.open(ImportFileStudentComponent, {
      data: dataImport,
      disableClose: true,
      hasBackdrop: true,
      width: '446px'
    }).afterClosed().subscribe(res => {
      if (res) this.loadGradeLevel();
    });
  }

  exportData() {
    removeEmptyQuery(this.searchModel);
    const searchExport = {
      ...this.searchModel,
      gradeId: this.searchModel.gradeLevel,
      years: this.currentYearOnMainScreen
    }
    console.log('searchExport', searchExport);
    this.studentService.export(searchExport).subscribe((res) => {
      if (res) download(res, exportName('DS_HocSinh_'));
    });
  }

  tran(key): string {
    return this.translate.instant(key)
  }

  translateList(list) {
    list.forEach(l => {
      l.value.length = 0
      l.data.forEach(d => {
        l.value.push({
          name: this.translate.instant(d.name),
          id: d.id,
          color: d.color
        })
      })
    })
  }

  removeStyle() {
    const removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
    const currentValue =  removeStyle.style.getPropertyValue('width');
    console.log(currentValue);
    const newCurrentValueFloat = currentValue.slice(0,-2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    const newValue = newCurrentValueInt + 15;
    console.log(newValue)
    removeStyle.style.width=`${newValue}px`;
    console.log(removeStyle.style.width);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
