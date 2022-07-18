import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ClassReportService} from "./class-report.service";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {ToastrService} from "ngx-toastr";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../core/auth/_services";
import { environment } from "../../../../../environments/environment"
import { NO_ROW_GRID_TEMPLATE } from '../../../../helpers/constants'
import {takeUntil} from "rxjs/operators";
import * as moment from "moment";
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'class-report',
  templateUrl: './class-report.component.html',
  styleUrls: ['./class-report.component.scss']
})
export class ClassReportComponent implements OnInit, AfterViewInit {

  scoreText = [
    {value: this.translate.instant('REPORT_CLASS.CT'), color: '#D14343;'},
    {value: this.translate.instant('REPORT_CLASS.MG'), color: '#52BD94;'},
    {value: this.translate.instant('REPORT_CLASS.PASS'), color: '#52BD94;'},
    {value: this.translate.instant('REPORT_CLASS.NOTPASS'), color: '#D14343;'},
  ]
  hide = true;
  defaultColDef;
  subscription: Subscription;
  semester;
  semesterName = 'a';
  dataSemester;
  month;
  dataClassRoom;
  classRoom;
  schoolYear;
  rowSelect;
  currentUser;
  formSearch: any = {};
  rowData = [];
  headerData;
  data;
  currentPage = 1;
  pageSize = 10;
  gridApi;
  headerHeight = 50;
  rowHeight = 56;
  gridColumnApi;
  cacheBlockSize = 10;
  setColumn;
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  showSave = false;
  showCancel = false;
  disableStatus = true;
  disableSearch = false;
  showUpdate = true;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  dataAbility;
  columnDefs: any
  ROLE_PARAM = environment.ROLE
  isDisabled: boolean = false
  hasAuth: boolean = true
  currentSemester
  hasRecord
  loadingTemplate = this.translate.instant('REPORT_CLASS.LOADING')
  className;
  linkSchoolYear;
  linkClassRoom;
  linkSemester;
  linkGradeLevel;
  linkSemesterName;
  langKey;
  constructor(private attendanceStudentService: ClassReportService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private toast: ToastrService,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private classRoomService: ClassroomService,
              private academicAbilitiesService: ClassReportService,
              private classReportService: ClassReportService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private translate: TranslateService) {
    this.route.params.subscribe(param => {
      if(param.id !== null) {
        try {
          // du lieu tu report gui qua
          const value = decodeURIComponent(escape(window.atob( param.id.slice(10)))).split('/');
          console.log(value);
          this.linkSchoolYear = value[0];
          this.linkSemester = value[1];
          this.linkClassRoom = value[2];
          const grade: number = +value[3];
          this.linkGradeLevel = grade;
          this.linkSemesterName = value[4];
        } catch (e) {
        }
      }
    });
    this.langKey = (localStorage.getItem('language'));
  }



  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.checkAuthorities();
    this.loadCurrentYear();
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (currentYear) => {
        if(this.linkSchoolYear != null){
          this.schoolYear = this.linkSchoolYear;
        }
        else{
          this.schoolYear = currentYear;
        }
        if (currentYear !== '') {
          this.loadGradeLevel();
          this.getSemester()
        }
      }
    );

  }
  listGradeLevel = [];
  selectedGradeLevel = null;
  loadGradeLevel(): void {
    this.classReportService
        .getGrade()
        .subscribe({
          next: (res) => {
            this.listGradeLevel = res;
            if(this.linkGradeLevel != null) {
              this.selectedGradeLevel = this.linkGradeLevel;
            }
            else
              this.selectedGradeLevel = res[0].id;
            console.log({ listGradeLevel: this.listGradeLevel });
            this.changeDetectorRef.detectChanges();
            this.getClassRoom();
          },
        });
  }
  onChangeGradeLevel(gradeLevelId) {
    this.selectedGradeLevel = gradeLevelId;
    this.getClassRoom();
  }
  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.changeDetectorRef.detectChanges();
      this.search(page);
    }
  }
  gridColumnsChanged(param) {
    setTimeout( () => {
      this.resizeTwoLastColumns()
      param.api.sizeColumnsToFit()
    }, 500)
  }
  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    body.style.minWidth = `${header.offsetWidth}px`
  }

  createHeaderStart() {
    this.columnDefs = [
      {
        headerName: this.translate.instant('REPORT_CLASS.GRID.NO'),
        headerClass:'custom-merge-header-cr1',
        field: 'no',
        suppressNavigable: true,
        valueGetter: param => {
          return param.node.rowIndex + (((this.currentPage - 1) * this.pageSize) + 1)
        },
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          top: '15px',
          color: '#101840',
        },
        suppressMovable: true,
        pinned: 'left'
      },
      {
        headerName: this.translate.instant('REPORT_CLASS.GRID.STUDENT_CODE'),
        headerClass:'custom-merge-header-cr1',
        field: 'code',
        suppressNavigable: true,
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          // display: 'flex',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
        },
        tooltipField: 'code',
        suppressMovable: true,
        pinned: 'left'
      },
      {
        headerName: this.translate.instant('REPORT_CLASS.GRID.STUDENT_NAME'),
        headerClass:'custom-merge-header-cr1',
        field: 'fullName',
        suppressNavigable: true,
        minWidth: 140,
        maxWidth: 140,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          color: '#101840',
          // display: 'flex',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
        },
        tooltipField: 'fullName',
        suppressMovable: true,
        pinned: 'left'
      },
    ];
  }

  createHeaderCenter() {
    for(let i = 0; i < this.data.header.length; i++){
      this.rowSelect= {
        headerName: `${this.data.header[i].name}`,
        field: `${this.data.header[i].name}`,
        headerTooltip: `${this.data.header[i].name}`,
        children: [{
          headerName: `${this.data.header[i].coefficient === 'NX'? this.translate.instant('REPORT_CLASS.GRID.EVALUATE') : this.data.header[i].coefficient}`,
          headerClass: 'custom-merge-header-academic',
          suppressNavigable: true,
          headerTooltip: `${this.data.header[i].coefficient === 'NX'? this.translate.instant('REPORT_CLASS.GRID.EVALUATE') : this.data.header[i].coefficient}`,
          valueGetter: params => {
            params.api.dataAbility = this.dataAbility;
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto !== undefined ? dto.avgScore : ''
            return this.formatScore(score)
          },
          minWidth: 110,
          cellStyle: params => {
            const baseCss = {
              'font-weight': '600',
              'font-size': '12px',
              'line-height': '20px',
              'align-items': 'center',
              'white-space': 'nowrap',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
              'display': 'flex',
              'justify-content': 'center'
            }
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto !== undefined ? dto.avgScore : ''
            const [obj] = this.scoreText.filter(elm => elm.value.toUpperCase() === (score+'').toUpperCase())
            const color = { color: obj !== undefined ? obj.color : '#101840;'}
            return {...baseCss, ...color}
          },
          suppressMovable: true
        }],
      }
      this.columnDefs.push(this.rowSelect)
    };

  }

  createHeaderEnd() {
    console.log(this.semesterName);
    const diemTb = {
      // headerName: 'ĐIỂM TB',
      headerName: this.translate.instant('REPORT_CLASS.GRID.MEDIUM_SCORE'),
      minWidth: 100,
      maxWidth: 100,
      headerTooltip: this.translate.instant('REPORT_CLASS.GRID.MEDIUM_SCORE'),
      children: [{
        headerName: this.semesterName.toUpperCase(),
        suppressNavigable: true,
        headerClass:'custom-merge-header-academic1',
        field: 'avgScoreYear',
        valueGetter: params => {
          return params.data.avgScoreYear != null ? this.formatScore(params.data.avgScoreYear) : '-'
        },
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          color: '#101840',
          top: '15px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'text-align': 'center',
        },
        tooltipField: 'avgScoreYear',
        suppressMovable: true,
        pinned: 'right'
      }]
    }

    const hocLuc = {
      // headerName: 'HỌC LỰC',
      headerName: this.translate.instant('REPORT_CLASS.GRID.ACADEMIC_ABILITY'),
      headerClass:'custom-merge-header-academic3',
      minWidth: 100,
      maxWidth: 100,
      children: [{
        headerName: this.semesterName.toUpperCase(),
        suppressNavigable: true,
        field:'academicName',
        headerClass:'custom-merge-header-academic3',
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
            'font-weight': '500',
            'font-size': '12px',
            'line-height': '20px',
            'align-items': 'center',
            'color': '#101840',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
             top: '15px',
          'padding-left': '15px'
            // 'display': 'flex',
          },
        suppressMovable: true,
        tooltipField: 'academicName',
        pinned: 'right'
      }]
    }
    const conduct = {
      // headerName: 'Hạnh kiểm',
      headerName: this.translate.instant('REPORT_CLASS.GRID.CONDUCT'),
      headerClass:'custom-merge-header-academic3',
      minWidth: 100,
      maxWidth: 100,
      children: [{
        headerName: `${this.semesterName.toUpperCase()}`,
        suppressNavigable: true,
        field: `conductName`,
        headerClass:'custom-merge-header-academic3',
        minWidth: 100,
        maxWidth: 100,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          'color': '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
            top: '15px',
          'padding-left': '15px'
          // 'display': 'flex',
        },
        suppressMovable: true,
        tooltipField: 'conductName',
        pinned: 'right'
      }]
    }
    const attendance = {
      // headerName: 'SỐ NGÀY NGHỈ',
      headerName: this.translate.instant('REPORT_CLASS.GRID.NUMBER_HOLIDAY'),
      minWidth:100,
      maxWidth:100,
      children: [{
        // headerName: `P`,
        headerName: this.translate.instant('REPORT_CLASS.GRID.P'),
        suppressNavigable: true,
        field: 'attendanceP',
        headerClass:'custom-merge-header-academic1',
        minWidth: 50,
        maxWidth: 50,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          'color': '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'display': 'flex',
          'justify-content': 'center',
          'text-align': 'center',
          'margin-left': '3px'
        },
        suppressMovable: true,
        pinned: 'right'
      },
        {
          // headerName: `K`,
          headerName: this.translate.instant('REPORT_CLASS.GRID.K'),
          field: 'attendanceK',
          suppressNavigable: true,
          headerClass:'custom-merge-header-academic1',
          minWidth: 50,
          maxWidth: 50,
          cellStyle: {
            'font-weight': '500',
            'font-size': '12px',
            'line-height': '20px',
            'align-items': 'center',
            'color': '#101840',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'display': 'flex',
            'justify-content': 'center',
            'text-align': 'center',
            'margin-left': '3px'
          },
          suppressMovable: true,
          pinned: 'right'
        }]
    }
    const emulation = {
      headerName:'',
      headerClass:'custom-merge-header-cr',
      children:[{
        // headerName: 'DANH HIỆU THI ĐUA',
        headerName: this.translate.instant('REPORT_CLASS.GRID.EMULATION_TITLE'),
        headerClass: 'custom-merge-header-cr',
        field: 'competitionTitleName',
        minWidth: 150,
        maxWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'line-height': '20px',
          'align-items': 'center',
          'color': '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'justify-content': 'center',
          top: '15px',
          'padding-left': '15px'
          // 'display': 'flex',
        },
        tooltipField: 'competitionTitleName',
        pinned: 'right'
      }]
    };
    const rank = {
      headerName:'',
      headerClass:'custom-merge-header-cr',
      children:[{
      // headerName: 'XẾP HẠNG',
      headerName: this.translate.instant('REPORT_CLASS.GRID.RANK'),
      height:70,
      suppressNavigable: true,
      headerClass:'custom-merge-header-cr',
      field: 'rank',
      minWidth: 80,
      maxWidth: 80,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'line-height': '20px',
        'align-items': 'center',
        'color': '#101840',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'display': 'flex',
        'justify-content': 'center',
        'text-align': 'center',
      },
      suppressMovable: true,
      pinned: 'right'
      }]
    };

    this.columnDefs.push(diemTb);
    this.columnDefs.push(hocLuc);
    this.columnDefs.push(conduct);
    this.columnDefs.push(attendance);
    this.columnDefs.push(emulation);
    this.columnDefs.push(rank);
  }

  getGrid(){
    this.createHeaderStart()
    this.createHeaderCenter()
    this.createHeaderEnd()
  }

  search(page: number) {
    this.currentPage = page;
    this.hide = false;
    const form = {
      data: {
        schoolYear: this.schoolYear,
        semester: this.semester,
        classRoomCode: this.classRoom,
        langKey: this.langKey
      },
      page: this.currentPage,
      pageSize : this.pageSize
    };
    this.academicAbilitiesService.search(form).subscribe(res => {
      this.hide = true;
      this.data = res.data;
      this.rowData = res.data.body;
      this.headerData = res.data.header;
      this.first = 0
      this.last = 0
      this.total = 0
      if (res.total > 0) {
        this.total = res.total;
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.currentPage,
          this.totalPage
        );
        this.first = this.pageSize * (this.currentPage - 1) + 1;
        this.last = this.first + res.data.body.length - 1;
      }
      this.hasRecord = this.total !== 0
      this.linkSchoolYear = null;
      this.linkSemesterName = null;
      this.linkSemester = null;
      this.linkClassRoom = null;
      this.linkGradeLevel = null;
      this.getGrid();
      this.changeDetectorRef.detectChanges();
      // this.gridApi.sizeColumnsToFit();
    });
  }

  exportData() {
    this.hide = false;
    const form = {
        schoolYear: this.schoolYear,
        semester: this.semester,
        classRoomCode: this.classRoom,
        className: this.className,
        langKey: this.langKey
    };
    this.academicAbilitiesService
        .export(form)
        .subscribe((responseMessage) => {
          const file = new Blob([responseMessage], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const fileURL = URL.createObjectURL(file);
          // window.open(fileURL, '_blank');
          const anchor = document.createElement('a');
          // anchor.download = `Baocao_`+this.className+'_'+this.schoolYear+''
          anchor.download = this.translate.instant('REPORT_CLASS.NAME_FILE') + this.className+'_'+this.schoolYear+''
          anchor.href = fileURL;
          anchor.click();
        });
    this.hide = true;
  }

  getSemester() {
    const obj: any = {};
    obj.years = this.schoolYear;
    this.semester = null;
    this.academicAbilitiesService.getSemesterByYear(this.schoolYear).subscribe(res => {
      if(res.length >0){
        this.dataSemester = res;
        if(this.linkSemester != null){
          this.semester = this.linkSemester;
          this.semesterName = this.linkSemesterName;
          return;
        }
        // set default value semester
        res.forEach(item => {
          if (item.defaultValue) {
            this.currentSemester = item.value
            this.semester = item.value;
            this.semesterName = item.name;
          }
        })
        if (this.semester == null) {
          this.semester = res[0].value;
          this.semesterName= res[0].name;
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  getClassRoom() {
    this.classReportService.getClassRoom(this.selectedGradeLevel, this.schoolYear).subscribe(res => {
      if(res.length > 0){
        this.dataClassRoom = res;
        if(this.linkClassRoom != null){
          this.classRoom = this.linkClassRoom
        }
        else {
          this.classRoom = res[0].code;
        }
        this.className = res[0].name;
        this.search(1)
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  selectMonth(event) {
    this.month = event.value;
    this.changeDetectorRef.detectChanges();
  }

  selectSemester(event) {
      // this.isDisabled = this.currentSemester > event
      this.semester = event.value;
      this.semesterName = event.value == 0 ? this.translate.instant('REPORT_CLASS.YEAR') : event.name;
      this.search(1);
  }

  selectClass(event) {
    this.classRoom = event.code;
    this.className = event.name;
    this.search(1);
  }

  ngAfterViewInit() {
  }

  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit()
      this.resizeTwoLastColumns()
    }, 500)
  }

  formatScore(score): string {
    if (isNaN(score) || (score+'').length == 3) {
      return score;
    }
    if ((score+'').length == 1) {
      return (score+'.00').substring(0,3)
    }
    return (score+'.00').substring(0,4)
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      this.resizeTwoLastColumns()
    }, 500);
  }

  checkAuthorities(): void {

    if (this.currentUser.authorities.includes(this.ROLE_PARAM.HT) ||
    this.currentUser.authorities.includes(this.ROLE_PARAM.ADMIN) ) {

      if (!this.currentUser.authorities.includes(this.ROLE_PARAM.GV_CN))
        this.hasAuth = false
    }

  }



}
