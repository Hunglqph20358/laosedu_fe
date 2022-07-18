import {ChangeDetectorRef, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {DepartmentService} from '../../../../core/service/service-model/unit.service';
import {Department} from '../../../../core/service/model/department.model';
import {SchoolService} from '../../../../core/service/service-model/school.service';
import {HttpClient} from '@angular/common/http';
import {SchoolServices} from '../school/school.service';
import {GradeLevelService} from '../../../../core/service/service-model/grade-level.service';
import {Subject, Subscription} from 'rxjs';
import {NO_ROW_GRID_TEMPLATE} from '../../../../helpers/constants';
import {TranslateService} from '@ngx-translate/core';
import {DiligenceService} from '../../../../core/service/service-model/diligence.service';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {AcademicAbilitiesService} from '../academic-abilities/academic-abilities.service';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'kt-teachers',
  templateUrl: './diligence.component.html',
  styleUrls: ['./diligence.component.scss']
})
export class DiligenceComponent implements OnInit {
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  overlayLoadingTemplate;

  constructor(private modalService: BsModalService, private schoolService: SchoolService, public http: HttpClient,
              private deparmentService: DepartmentService,
              private gradeLevelService: GradeLevelService,
              private changeDetectorRef: ChangeDetectorRef,
              private classRoomService: ClassroomService,
              private diligenceService: DiligenceService,
              private translate: TranslateService,
              private attendanceStudentService: AcademicAbilitiesService,
              private academicAbilitiesService: AcademicAbilitiesService,
              private toatr: ToastrService, private schoolSv: SchoolServices) {
    this.overlayLoadingTemplate = `<span>${this.translate.instant('GRID.LOADING')}</span>`
    this.department = new Department();
    this.typeImportInsert = 0;
    this.themeName = 'red-theme';
  }

  value?: string;
  nodes = [];

  @ViewChild('importUnit') public importUnit: ModalDirective;
  @ViewChild('file') file: ElementRef;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  modalRef: BsModalRef;
  progress;

  gridApi;
  columnDefsTotal;
  rowDataTotal: any = [];
  rowDataTotalT: any = [];
  columnDefs;
  defaultColDef;
  defaultColDefTotal;
  autoGroupColumnDef;
  rowModelType;
  getServerSideGroupKey;
  rowData;

  groupDefaultExpanded;
  getDataPath
  typeUnit;
  typeImportInsert;
  typeImportUpdate;
  selectedFiles;

  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  selectDemo;
  codeSearch;

  fileName;
  fileSize;
  resultImport;
  department: Department = new Department();
  afuConfig;
  spaceWhite;
  specicalChar;
  autoGroupColumnDefTree;
  listUnitParent = [];
  listTeacher = [];
  tooltipShowDelay = 0;
  rowSelection = 'single';
  themeName: string;
  a = false;
  blCode: boolean;
  blName: boolean;
  blType: boolean;
  formDatas;
  userName;

  // xu ly khoa/ban
  deptId: any;
  deptList: any = [];

  dataMonth;
  monthValue;

  // xu ly chon học kỳ
  dataSemester;
  schoolYear;
  semester;
  semesterName = 'a';
  classRoom;

  itemCheck: any// map key tong

  // xu ly khoi
  listGradeLevel = [];
  selectedGradeLevel = null;
  unsubscribe$ = new Subject<void>();
  selectedClassId = null;
  listClass = [];
  subscription: Subscription;
  isShowImport = false;

  lsDay = [{name: this.translate.instant('DILIGENCE.MONDAY')}, 
  {name: this.translate.instant('DILIGENCE.TUESDAY')}, 
  {name: this.translate.instant('DILIGENCE.WEDNESDAY')}, 
  {name: this.translate.instant('DILIGENCE.THURSDAY')}, 
  {name: this.translate.instant('DILIGENCE.FRIDAY')}, 
  {name: this.translate.instant('DILIGENCE.SATURDAY')}, 
  {name: this.translate.instant('DILIGENCE.SUNDAY')}];

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  isDay(year, month) {
    const date = new Date(year, month, 1);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  isLast(year, month) {
    const date = new Date(year, month, 0);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  isHolidays(lsHolidays, getDate) {
    for (const i in lsHolidays) {
      if (new Date(lsHolidays[i]).getDate() === getDate) {
        return true;
      }
    }
    return false;
  }

  isTotalDay(year, month) {
    return new Date(year, month, 0).getDate();
  }


  getDaysArray(year, month, data, formDate, toDate, lsHolidays) {
    const monthIndex = month - 1; // 0..11 instead of 1..12
    const valueYear = year;
    const names = ['t2', 't3', 't4', 't5', 't6', 't7', 't8'];
    const date = new Date(valueYear, monthIndex, 1);
    const dayOfMonth = this.daysInMonth(month, valueYear);
    const formDate1 = new Date(formDate);
    const toDate1 = new Date(toDate);
    let check = 0;
    let check1 = 0;
    this.rowDataTotalT = [];
    while ((date.getMonth()) === monthIndex) {
      const arr = [];
      const arrValue = [];
      for (let i = 0; i < names?.length; i++) {
        if (check === 1) {
          for (let j = i; j <= names?.length; j++) {
            arr.push({key: names[j - 1], value: ''})
            arrValue.push({key: names[j - 1], value: '-1'})
          }
          this.rowDataTotalT.push(arr.reduce(
            (obj, item) => Object.assign(obj, {[item.key]: item.value, type: 0}), {}));
          this.rowDataTotalT.push(arrValue.reduce(
            (obj, item) => Object.assign(obj, {[item.key]: item.value, type: 1}), {}));
          return this.rowDataTotalT;
        }
        if (date.getDay() === i) {
          const getMonth = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
          // truong hop vao ngay chu nhat dau tien cua thang
          if (this.isDay(valueYear, month - 1) === 'Sunday' && check1 === 0) {
            arr.push({key: names[6], value: '01' + '/' + getMonth})
            if (month == (formDate1.getMonth() + 1) || month == (toDate1.getMonth() + 1)) {
              // ngay chu nhat dau thang la ngay bat dau học kỳ hoặc kết thúc học kỳ
              if(formDate1.getDate() == 1 || toDate1.getDate() == 1) {
                arrValue.push({key: names[6], value: null})
              } else {
                arrValue.push({key: names[6], value: '-1'})
              }
            } else {
              arrValue.push({key: names[6], value: null})
            }
            check1 = 1;
            for (let j = 0; j < 6; j++) {
              arr.push({key: names[j], value: ''})
              arrValue.push({key: names[j], value: '-1'})
            }
            this.rowDataTotalT.push(arr.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value, type: 0}), {}));
            this.rowDataTotalT.push(arrValue.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value, type: 1}), {}));
          }
          // lay 2 nhay cuoi tuan cua thang
          if (date.getDay() === 6) {
            // truownfg hop ngay cuoi cung cua thang la t7
            if (this.isLast(valueYear, month) === 'Saturday' && this.isTotalDay(valueYear, month) === date.getDate()) {
              arr.push({key: names[6], value: null})
              arr.push({key: names[5], value: (date.getDate() < 9 ? '0' : '') + date.getDate() + '/' + getMonth, isColor: 1})
              arrValue.push({key: names[6], value: '-1'})
              arrValue.push({key: names[5], value: null})
            } else {
              arr.push({key: names[6], value: (date.getDate() < 9 ? '0' : '') + (date.getDate() + 1) + '/' + getMonth, isColor: 1})
              arr.push({key: names[5], value: (date.getDate() < 9 ? '0' : '') + date.getDate() + '/' + getMonth, isColor: 1})
              if (month == (formDate1.getMonth() + 1) || month == (toDate1.getMonth() + 1)) {
                if (month == (formDate1.getMonth() + 1) && date.getDate() < formDate1.getDate()) {
                  arrValue.push({key: names[6], value: '-1'})
                  arrValue.push({key: names[5], value: '-1'})
                } else if (month == (toDate1.getMonth() + 1) &&  date.getDate() > toDate1.getDate()) {
                  arrValue.push({key: names[6], value: '-1'})
                  arrValue.push({key: names[5], value: '-1'})
                } else {
                  arrValue.push({key: names[6], value: null})
                  arrValue.push({key: names[5], value: null})
                }
              } else {
                arrValue.push({key: names[6], value: null})
                arrValue.push({key: names[5], value: null})
              }
            }
          } else {
            arr.push({key: names[date.getDay() - 1], value: (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + getMonth})
            const stt = date.getDate();
            if (data !== null) {
              if (month == (formDate1.getMonth() + 1) || month == (toDate1.getMonth() + 1)) {
                // thang da chon co ngay bat dau or ket thuc hoc ky
                if (month == (formDate1.getMonth() + 1) && date.getDate() < formDate1.getDate()) {
                  arrValue.push({key: names[date.getDay() - 1], value: '-1'})
                } else if (month == (toDate1.getMonth() + 1) && date.getDate() > toDate1.getDate()) {
                  arrValue.push({key: names[date.getDay() - 1], value: '-1'})
                }
                // ngay nghi le trong thang bat dau or ket thuc hoc ky
                else if (this.isHolidays(lsHolidays, date.getDate())) {
                  arrValue.push({key: names[date.getDay() - 1], value: '-2'})
                } else {
                  arrValue.push({key: names[date.getDay() - 1], value: data[stt - 1]?.checkDate})
                }
              } else {
                // ngay nghi le trong thang bt
                if (this.isHolidays(lsHolidays, date.getDate())) {
                  arrValue.push({key: names[date.getDay() - 1], value: '-2'})
                } else {
                  arrValue.push({key: names[date.getDay() - 1], value: data[stt - 1]?.checkDate})
                }
              }
            } else {
              arrValue.push({key: names[date.getDay() - 1], value: '-'})
            }
          }
          if (date.getDate() === dayOfMonth) {
            check = 1;
          }
          // th vao chu nhat vao ngay cuoi cung cua thang
          if (this.isLast(valueYear, month) === 'Sunday' && this.isTotalDay(valueYear, month) === date.getDate()) {
            this.rowDataTotalT.push(arr.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value, type: 0}), {}));
            this.rowDataTotalT.push(arrValue.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value, type: 1}), {}));
            return this.rowDataTotalT;
          }
          date.setDate(date.getDate() + 1);
        }
      }
      this.rowDataTotalT.push(arr.reduce(
        (obj, item) => Object.assign(obj, {[item.key]: item.value, type: 0}), {}));
      this.rowDataTotalT.push(arrValue.reduce(
        (obj, item) => Object.assign(obj, {[item.key]: item.value, type: 1}), {}));
    }
    return this.rowDataTotalT;
  }

  onChangeMonth(month) {
    this.monthValue = month;
    this.searchData();
  }

  selectSemester(event) {
    this.semester = event;
    this.getMonth();
  }

  jsUcfirst(input) {
    const splitStr = input.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  getSemester() {
    const obj: any = {};
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getSemesterByYear(this.schoolYear).subscribe(res => {
      if (res !== null && res.length > 0) {
        const arr = res.filter(item => item.value !== '0');
        this.dataSemester = arr;
        arr.forEach(item => {
          if (item.defaultValue) {
            this.semester = item.value;
          }
        })
        if (this.semester == null) {
          this.semester = arr[0].value;
        }
        this.getMonth();
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  getMonth() {
    const objSearch: any = {
      years: this.schoolYear,
      semester: this.semester
    };
    this.diligenceService.getMonth(objSearch).subscribe(res => {
      if (res !== null && res.length > 0) {
        this.monthValue = null;
        this.dataMonth = res;
        res.forEach(item => {
          if (item.defaultValue) {
            this.monthValue = item.value;
          }
        })
        if (this.monthValue == null) {
          this.monthValue = res[0].value;
        }
      } else {
        this.monthValue = null;
        this.dataMonth = null;
        this.ngSelectComponent.handleArrowClick();
      }
      this.searchData();
    });
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (schoolYear) => {
        this.schoolYear = schoolYear;
        if (schoolYear !== '') {
          this.getSemester();
        }
      }
    );
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    document.querySelector('#selectedRows').innerHTML =
      selectedRows.length === 1 ? selectedRows[0].athlete : '';
  }

  ngOnInit(): void {
    this.schoolSv.loading.subscribe(loading => {
    });
    this.schoolSv.sideBar.subscribe(a => {
      this.a = a;// dong mo sidebar
    });

    this.loadCurrentYear();
    setTimeout(() => {
      this.value = '1001';
    }, 1000);

  }

  validateString(input: any) {
    if (input === undefined || input === null || input === '') {
      return '-'
    }
    return input;
  }

  checkInput(years, semester, month) {
    if (years === null || semester === null || month === null || years === undefined || semester === undefined || month === undefined) {
      return true;
    }
  }

  searchData() {
    this.rowData = [];
    const objSearch: any = {
      years: this.schoolYear,
      semester: this.semester,
      month: this.monthValue
    };
    if (!this.checkInput(objSearch.years, objSearch.semester, objSearch.month)) {
      this.diligenceService.getAllDiligence(objSearch).subscribe(res => {
        this.rowData = res;
        this.itemCheck = res;
        this.userName = this.jsUcfirst( res?.studentName.toLowerCase());
        const arr = this.getDaysArray(res.currentYear, this.monthValue,
          res.lstAttendanceDetailDTOByStudentCode, res.fromDate,
          res.toDate, res.holidays);
        console.log(arr);
        for (let i = 0; i < arr?.length; i++) {
          delete arr[i].undefined;
          if (Object.keys(arr[i]).length === 1 && Object.keys(arr[i])[0] === 'type') {
            arr.splice(i, 2)
          }
        }
        this.rowDataTotal = arr;
        this.changeDetectorRef.detectChanges();
      });
    }

  }
}

export interface ItemData {
  totalGoingSchool: any;
  totalCount: any;
  totalRestByReason: any;
  totalRestNoReason: any;

}

@Pipe({name: 'flyingHeroes'})
export class FlyingHeroesPipe implements PipeTransform {
  transform(allHeroes: any[]) {
    return allHeroes;
  }
}
