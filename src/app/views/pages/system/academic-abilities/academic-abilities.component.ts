import {AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ClassroomService} from '../../../../core/service/service-model/classroom.service';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AcademicAbilitiesService} from "./academic-abilities.service";
import {ConfirmSaveComponent} from "./confirm-save/confirm-save.component";
import {ToastrService} from "ngx-toastr";
import {AgGridSelectComponent} from "./ag-grid-select/ag-grid-select.component";
import {CommonServiceService} from "../../../../core/service/utils/common-service.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../core/auth/_services";
import { environment } from "../../../../../environments/environment"
import { NO_ROW_GRID_TEMPLATE } from '../../../../helpers/constants'
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'attendance-student',
  templateUrl: './academic-abilities.component.html',
  styleUrls: ['./academic-abilities.component.scss']
})
export class AcademicAbilitiesComponent implements OnInit, AfterViewInit {

  scoreText = [
    {value: 'CT', color: '#D14343;'},
    {value: 'MG', color: '#52BD94;'},
    {value: 'Đạt', color: '#52BD94;'},
    {value: 'Không đạt', color: '#D14343;'},
  ]
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
  columnDefs: any = []
  ROLE_PARAM = environment.ROLE
  isDisabled: boolean = false
  hasAuth: boolean = true
  currentSemester
  hasRecord
  isLoading

  constructor(
    private attendanceStudentService: AcademicAbilitiesService,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private toast: ToastrService,
    private commonService: CommonServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private classRoomService: ClassroomService,
    private academicAbilitiesService: AcademicAbilitiesService,
    private auth: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.checkAuthorities()
    this.loadCurrentYear();
    this.getAbility();
  }

  loadCurrentYear(): void {
    this.subscription = this.classRoomService.yearCurrent$.subscribe(
      (currentYear) => {
        this.schoolYear = currentYear;
        if (currentYear !== '') {
          this.getSemester()
        }
      }
    );

  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.changeDetectorRef.detectChanges();
      this.search(page);
    }
  }

  createHeaderStart() {
    this.columnDefs = [
      {
        headerName: this.trans('NO'),
        headerClass:'custom-merge-header-as',
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
        headerName: this.trans('STUDENT_CODE'),
        headerClass:'custom-merge-header-as',
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
        headerName: this.trans('STUDENT_NAME'),
        headerClass:'custom-merge-header-as',
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
      // const headerName =  `${this.data.header[i].coefficient == 'NX'? this.translate.instant('ACADEMIC_ABILITY.NX') : this.data.header[i].coefficient.replace('HS', this.translate.instant('ACADEMIC_ABILITY.HS')+' ')}`
      const headerName = this.translate.instant(`ACADEMIC_ABILITY.${this.data.header[i].coefficient.substring(0,2)}`) + this.data.header[i].coefficient.substring(2)
      this.rowSelect= {
        headerName: `${this.data.header[i].name}`,
        field: `${this.data.header[i].name}`,
        headerTooltip: `${this.data.header[i].name}`,
        children: [{
          headerName: headerName,
          headerClass: 'custom-merge-header-academic',
          suppressNavigable: true,
          headerTooltip:  headerName,
          valueGetter: params => {
            params.api.dataAbility = this.dataAbility;
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto != undefined ? dto.avgScore : ''
            return this.formatScore(score)
          },
          tooltipValueGetter: params => {
            params.api.dataAbility = this.dataAbility;
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto != undefined ? dto.avgScore : ''
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
              'display': 'block',
              'top': '16px',
              'text-align': 'center',
            }
            const dto = params.data.gradebookSubjectsDetailsDTOS[i]
            const score = dto != undefined ? dto.avgScore : ''
            const [obj] = this.scoreText.filter(elm => elm.value.toUpperCase() == (score+'').toUpperCase())
            const color = { color: obj != undefined ? obj.color : '#101840;'}
            return {...baseCss, ...color}
          },
          suppressMovable: true
        }],
      }
      this.columnDefs.push(this.rowSelect)
    };

  }

  createHeaderEnd() {
    const diemTb = {
      headerName: this.trans('AVERAGE'),
      headerTooltip: this.trans('AVERAGE'),
      children: [{
        headerName: `${this.semesterName.toUpperCase()}`,
        suppressNavigable: true,
        headerClass:'custom-merge-header-academic1',
        headerTooltip: `${this.semesterName.toUpperCase()}`,
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
          'color': '#101840',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          'overflow': 'hidden',
          'display': 'flex',
          'justify-content': 'center'
        },
        tooltipField: 'avgScoreYear',
        suppressMovable: true,
        pinned: 'right'
      }]
    }

    const hocLuc = {
      headerName: this.trans('ABILITY'),
      children: [{
        headerName: `${this.semesterName.toUpperCase()}`,
        suppressNavigable: true,
        headerClass:'custom-merge-header-academic1',
        minWidth: 160,
        maxWidth: 160,
        cellRendererFramework: AgGridSelectComponent,
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
          'justify-content': 'left'
         
        },
        suppressMovable: true,
        pinned: 'right'
      }],
    }

    this.columnDefs.push(diemTb)
    this.columnDefs.push(hocLuc)
  }

  getGrid(){
    this.createHeaderStart()
    this.createHeaderCenter()
    this.createHeaderEnd()
  }

  search(page: number) {
    this.clickCancel()
    this.changeLoading(true)
    this.currentPage = page;
    const form = {
      data: {
        schoolYear: this.schoolYear,
        semester: this.semester,
        classRoomCode: this.classRoom
      },
      page: this.currentPage,
      pageSize : this.pageSize
    };
    this.academicAbilitiesService.search(form).subscribe(res => {
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

      this.getGrid();
      this.changeDetectorRef.detectChanges();
      this.changeLoading(false)
    });
  }
  getAbility(){
    this.academicAbilitiesService.getAbility().subscribe(res => {
      this.dataAbility = res.map( ability => {
        if (this.translate.currentLang != 'vn')
          ability.name = ability[`name${this.translate.currentLang.toUpperCase()}`]
        return ability
      });
    });
  }
  getSemester() {
    const obj: any = {};
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getSemesterByYear(this.schoolYear).subscribe(res => {
      if(res.length >0){

        this.dataSemester = res.map(semester => {
          semester.name = this.translate.instant(`GRADEBOOK.SEMESTER${semester.value}`)
          if (semester.value == 0)
            semester.name  = this.translate.instant('ACADEMIC_ABILITY.GRID.ALL_YEAR')
          return semester
        });
        // set default value semester
        res.forEach(item => {
          if (item.defaultValue) {
            this.currentSemester = item.value
            this.semester = item.value;
            this.semesterName = this.translate.instant(`GRADEBOOK.SEMESTER${item.value}`)
            if (item.value == 0) 
              this.semesterName  = this.translate.instant('ACADEMIC_ABILITY.GRID.ALL_YEAR')
          }
        })
        if (this.semester == null) {
          this.semester = res[0].value;
          this.semesterName = this.translate.instant(`GRADEBOOK.SEMESTER${res[0].value}`)
          if (res[0].value == 0) 
            this.semesterName  = this.translate.instant('ACADEMIC_ABILITY.GRID.ALL_YEAR')
        }

        if (this.hasAuth) {
          this.getClassRoom();
        }
        this.validateButtonUpdate()

      }

      this.changeDetectorRef.detectChanges();
    });
  }

  updateData() {
    const confirm = {
      title: this.trans('TITLE_CONFIRM'),
      message: this.trans('MESSAGE_CONFIRM')
    };
    this.matDialog.open(ConfirmSaveComponent, {
      data: confirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event == 'confirm') {
        this.changeLoading(true)
        this.academicAbilitiesService.updateData(this.rowData).subscribe(rs => {
          if (rs.status == 'OK') {
            this.toast.success(this.trans('NOTIFY.SUCCESS'));

          } else {
            this.toast.error(this.trans('NOTIFY.FAIL'));
          }
          this.changeLoading(false)
          this.search(1);
        });
        this.showSave = false;
        this.showCancel = false;
        this.showUpdate = true;
        this.disableStatus = true;
        this.disableSearch = false;
        this.gridApi.disableStatus = true
      }

    });
  }
  clickUpdate() {
    this.showUpdate = false;
    this.showSave = true;
    this.showCancel = true;
    this.disableStatus = false;
    this.disableSearch = true;
    this.gridApi.disableStatus = false
    this.gridApi.setRowData(this.rowData);
    // this.search(this.currentPage)
    this.changeDetectorRef.detectChanges();
  }
  clickCancel() {
    this.showSave = false;
    this.showCancel = false;
    this.showUpdate = true;
    this.disableStatus = true;
    this.disableSearch = false;
    this.gridApi.disableStatus = true
    // this.search(this.currentPage)
    this.gridApi.setRowData(this.rowData)
    this.changeDetectorRef.detectChanges();
  }
  getClassRoom() {
    const obj: any = {};
    obj.userId = this.currentUser.id;
    obj.years = this.schoolYear;
    this.academicAbilitiesService.getClassroomByUserAndYear(obj).subscribe(res => {
      if(res.length > 0){
        this.dataClassRoom = res;
        this.classRoom = res[0].value;
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
    if (this.hasAuth) {
      // this.isDisabled = this.currentSemester > event
      this.semester = event.value;
      this.semesterName = event.value == 0 ? this.trans('ALL_YEAR') : this.translate.instant(`GRADEBOOK.SEMESTER${event.value}`)
      this.search(1);
      this.validateButtonUpdate()
    }
  }

  selectClass(event) {
    this.classRoom = event.value;
    this.search(1);
  }

  ngAfterViewInit() {
    
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  gridColumnsChanged(param) {
    setTimeout( () => {
      this.resizeTwoLastColumns()
      param.api.sizeColumnsToFit()
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
    this.gridApi.disableStatus = this.disableStatus
    params.api.sizeColumnsToFit();
  }

  changeLoading(loading) {
    this.isLoading = loading
    this.changeDetectorRef.detectChanges()
  }

  resizeTwoLastColumns(): void {
    const header = (document.querySelector('.ag-pinned-right-header') as HTMLElement)
    const body = (document.querySelector('.ag-pinned-right-cols-container') as HTMLElement)
    console.log(header.offsetWidth)
    console.log(header)
    body.style.minWidth = `${header.offsetWidth}px`
  }

  checkAuthorities(): void {
    
    if (this.currentUser.authorities.includes(this.ROLE_PARAM.HT) ||
    this.currentUser.authorities.includes(this.ROLE_PARAM.ADMIN) ) {

      if (!this.currentUser.authorities.includes(this.ROLE_PARAM.GV_CN)) 
        this.hasAuth = false
    }

  }

  trans(key): string {
    return this.translate.instant(`ACADEMIC_ABILITY.GRID.${key}`)
  }

  validateButtonUpdate(): void {
    if (this.semester  == this.currentSemester ||
      (this.semester == 0 && this.currentSemester == this.dataSemester[this.dataSemester.length - 2].value) 
      ) {this.isDisabled = false; return}
    
    this.isDisabled = true
  }


}
