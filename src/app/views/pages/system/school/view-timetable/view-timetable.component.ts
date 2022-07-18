import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {ToastrService} from 'ngx-toastr';
import {SchoolServices} from '../school.service';
import {DatePipe, Location} from '@angular/common';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {CommonFunction} from '../../../../../core/service/utils/common-function';

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-view-timetable',
  templateUrl: './view-timetable.component.html',
  styleUrls: ['./view-timetable.component.scss']
})

export class ViewTimetableComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  empty = true;
  delete = false;
  formData;
  isSubmit = false;
  formatDate = 'yyyy-MM-dd';
  dropDownDefault: DataDropdown = {
    code: '',
    name: null
  };
  dynamicTable = [0, 5];
  applyDateUpdate;
  showErr = false;
  messageErr;
  modalRef: BsModalRef;
  form: FormGroup;
  listGradeLevels = [];
  listClass = [];
  listSemester = [];
  dataGrid: any = {};
  rangeWithDots;
  lStorage;
  headerHeight = 56;
  rowHeight = 50;
  rowData;
  gridApi;
  gridColumnApi;
  totalRecord = 0;
  first = 1;
  last = 10;
  noRowsTemplate = this.translate.instant('PARENTS.NO_INFO');
  total = 0;
  totalPage = 0;
  subscription;
  years;
  fileName;
  fileSize;
  resultImport;
  isUpdate = false;
  isShowImport = false;
  role;
  fromDate;
  toDate;
  listSubjectTeacher = [];
  className;
  applyYear;
  langKey;

  dataDefault = {
    morning: [
      {
        lessonCode: '1',
        lessonName: 'Tiết 1',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '2',
        lessonName: 'Tiết 2',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '3',
        lessonName: 'Tiết 3',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '4',
        lessonName: 'Tiết 4',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '5',
        lessonName: 'Tiết 5',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      }
    ],
    afternoon: [
      {
        lessonCode: '1',
        lessonName: 'Tiết 1',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '2',
        lessonName: 'Tiết 2',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: '',
            teacherName: ''
          }
        ]
      },
      {
        lessonCode: '3',
        lessonName: 'Tiết 3',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: null,
            teacherName: null
          }
        ]
      },
      {
        lessonCode: '4',
        lessonName: 'Tiết 4',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: '',
            teacherName: ''
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: null,
            teacherName: null
          }
        ]
      },
      {
        lessonCode: '5',
        lessonName: 'Tiết 5',
        dayList: [
          {
            dayCode: 't2',
            dayName: 'Thứ 2',
            date: '20/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't3',
            dayName: 'Thứ 3',
            date: '21/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't4',
            dayName: 'Thứ 4',
            date: '22/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't5',
            dayName: 'Thứ 5',
            date: '23/09',
            subjectName: null,
            teacherName: null
          },
          {
            dayCode: 't6',
            dayName: 'Thứ 6',
            date: '24/09',
            subjectName: null,
            teacherName: null
          }
        ]
      }
    ],
  }


  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private classroomService: ClassroomService,
              private commonService: CommonServiceService,
              private toatr: ToastrService,
              private schoolServices: SchoolServices,
              private datePipe: DatePipe,
              private matDialog: MatDialog,
              private location: Location
  ) {
    this.langKey = (localStorage.getItem('language'));
  }

  ngOnInit(): void {
    this.getYear();
    this.lStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.dropDownDefault.name = this.translate.instant('TEACHER_RATING.ALL');
  }

  getClassName() {
    const body = Object.assign({},{
      year: this.years,
      userLogin: JSON.parse(localStorage.getItem('currentUser')).login,  // tên user đăng nhập
    });
    this.schoolServices.getClassViewTimeTable(body).subscribe(res => {
      this.className = res ? res.name : null;
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      applyDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      semester: ['', [Validators.required]]
    });
    this.cdr.detectChanges();

    this.form.get('semester').valueChanges.subscribe(val => {
      const data = this.listSemester.find(it => it.semester === val);
      if (data) {
        this.fromDate = this.datePipe.transform(data.fromDate, this.formatDate);
        this.toDate = this.datePipe.transform(data.toDate, this.formatDate);
      }
    });
    this.form.valueChanges.subscribe(() => this.searchEvent());

    this.searchEvent();
  }

  getData() {
    // forkJoin(.schoolServices.getGradeLevels(),
    // ).subscribe(([resGradeLevels]) => {
    //
    // });
  }

  cancelImport() {
    this.modalRef.hide();
  }

  exportFile() {
    const data = this.form.value;
    const grade = this.listGradeLevels.find(it => Number(it.id) === Number(data.gradeLevel));
    // tslint:disable-next-line:forin
    const body = Object.assign({}, data, {
      year: this.years, appType: 'LESSON', apType: 'DAY',
      gradeLevel: grade ? grade.code : data.gradeLevel,
      applyYear: this.applyYear,
      userLogin: JSON.parse(localStorage.getItem('currentUser')).login,  // tên user đăng nhập
      langKey: this.langKey
    });
    console.log(body);
    const fileName = this.translate.instant('SCHEDULE_TIMETABLE.NAME_FILE') + `_${data ? this.className : ''}_${moment().format('DDMMYYYY').toString()}.xls`;
    this.schoolServices.scheduleExport(body, fileName);
  }

  searchEvent() {
    this.isSubmit = true;
    const data = this.form.value;
    this.changeApplyDate();
    if (this.showErr && this.messageErr) {
      // if(!this.messageErr){
      //   this.calculateDate();
      // }
      return;
    }
    // tslint:disable-next-line:forin
    const body = Object.assign({}, data, {
      year: this.years,
      userLogin: JSON.parse(localStorage.getItem('currentUser')).login,  // tên user đăng nhập
    });
    this.schoolServices.onSearchViewTimeTable(body).subscribe(res => {
      this.applyYear = res.applyDate;
      this.dataGrid = res;

     // if(!this.dataGrid || this.dataGrid.morning.length < 1 ){
     //   this.calculateDate()
     // }
      this.cdr.detectChanges();
    });
  }

  changeApplyDate() {
    const dateApply = this.form.value.applyDate;
    if (dateApply === '' || dateApply === undefined) {
      if (this.empty || this.delete) {
        this.showErr = true;
        this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_BLANK');
        return;
      }

      this.empty = false;

      this.showErr = true;
      this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLYDATE_NOT_REQUIRT');
      return;
    }
    const dateValue = new Date(dateApply).getTime();

    let includeSemester = false;

    for (const it of this.listSemester) {
      const from = new Date(it.fromDate).getTime();
      const to = new Date(it.toDate).getTime();
      if (dateValue > from && dateValue < to) {
        includeSemester = true;
        break;
      }
    }

    if (includeSemester === false) {
      this.showErr = true;
      this.messageErr = null;
      return;
    }

    // check them endDate
    const fromDate = new Date(this.fromDate).getTime();
    const toDate = new Date(this.toDate).getTime();
    if (dateValue < fromDate || dateValue > toDate) {
      this.showErr = true;
      // this.messageErr = `Ngày áp dụng không thuộc học kì đã chọn của năm học ${this.years}`;
      this.messageErr = this.translate.instant('SCHEDULE_TIMETABLE.MSG.APPLY_DATE_NOT_YEAR') + ' ' + this.years;
      return;
    }
    this.showErr = false;
    this.messageErr = '';
  }

  getYear() {
    this.classroomService.yearCurrent$.subscribe(res => {
      this.years = res;
      if (!this.form && this.years) {
        this.getClassName();
        this.buildForm();
        this.getData();
      }
      if (this.years) {
        this.getDateToFrom(this.years);
        this.showErr = false;
        this.messageErr = '';
      }
    });
  }

  getDateToFrom(year: any) {
    this.schoolServices.getYear(year).subscribe(res => {
      this.listSemester = res && res.semesterList ? res.semesterList : [];
      if (this.listSemester.length > 0) {
        this.listSemester.map(it => {
          it.label = CommonFunction.mapSemester(it.semester).replace('Học kỳ', this.translate.instant('STUDENT.SEMESTER2'));;
          return it;
        })
      }
      this.form.get('semester').setValue(res && res.semesterCurrent ? res.semesterCurrent.semester : null);
    });
  }

  change(event) {
    console.log(event);
  }

  keyUpDate(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      this.empty = false;
      this.delete = false;
    }
    if (event.keyCode === 8) {
      this.delete = true;
    }
  }


  tooltip(value, isTeacher) {
    if (isTeacher) {
      const data = this.listSubjectTeacher.find(it => it.teacherCode === value);
      return data ? data.teacherName : null;
    } else {
      const data = this.listSubjectTeacher.find(it => it.subjectCode === value);
      return data ? data.nameSubject : null;
    }
  }
  calculateDate(){
    const date = this.form.value.applyDate;
    this.applyYear = date;
    const data = JSON.parse(JSON.stringify(this.dataDefault))
    const curr = new Date(date);

    for (let i = 1; i < 6; i ++ ){
      const day = new Date(curr.setDate(curr.getDate() - curr.getDay()+i));
      data.morning[0].dayList[i-1].date = day.getDate() + '/' + (day.getMonth() + 1);
    }
    this.dataGrid = data;
    this.cdr.detectChanges();
  }
}
