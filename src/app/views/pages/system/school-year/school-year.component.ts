import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSchoolYearComponent } from './create-school-year/create-school-year.component';
import { SchoolYearService } from './school-year.service';
import { ActionShoolYearComponent } from './action-shool-year/action-shool-year.component';
import { NotiService } from '../../../../core/service/service-model/notification.service';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service'
import { TranslateService } from '@ngx-translate/core';
import { NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';

@Component({
  selector: 'kt-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.scss']
})
export class SchoolYearComponent implements OnInit, AfterViewInit {

  @ViewChild('agGrid')

  POPUP_WIDTH = '466px'
  POPUP_HEIGHT = '586px'
  HEADER_HEIGHT = 56
  ROW_HEIGHT = 50
  PAGE_SIZE = 10

  columnDefs;
  rowData: any[];
  gridApi;
  gridColumnApi;

  rowStyle: any

  data: any
  first
  last
  total = 0
  currentPage = 1
  rangeWithDots: any
  totalPage: number
  isLoading

  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    'line-height': '20px',
    'color': '#101840',
    'align-items': 'center',
    'display': 'flex',
    'font-weight': '500',
    'font-family': 'Inter',
    "border-right": "none"
  }

  semesterAmount = 2;
  context: any;
  overlayNoRowTemplate

  constructor(
    private dialog: MatDialog,
    private service: SchoolYearService,
    private notiService: NotiService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private translate: TranslateService
  ) {
    this.context = {
      componentParent: this
    }
    this.overlayNoRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'))
  }

  ngOnInit(): void {

    setTimeout(this.removeStyle,2000);
    this.currentPage = 1

    this.rowStyle = (param) => {
      return param.node.rowIndex % 2 !== 0 ? {background: '#F9FAFC;'} : {background: '#FFFFFF;'}
    }

    this.loadData()
  }

  loadData(): void {
    this.rowData = []
    this.changeLoading(true)
    this.service.getAll({size: `${this.PAGE_SIZE}`, page: `${this.currentPage}`}).subscribe( {
      next: (resp) => {
        this.changeLoading(false)
        if (resp.status !== 'OK') {
          this.notiService.showNoti(resp.message, 'error')
          return
        }

        this.total = resp.data.total

        this.totalPage = Math.ceil(this.total / this.PAGE_SIZE);
        this.rangeWithDots = this.commonService.pagination(this.currentPage, this.totalPage);

        this.rowData = resp.data.schoolYears
        this.semesterAmount = this.getTheMostSemesterAmount().semesterAmount

        this.createDefaultHeader()
        this.createSemesterHeader()
        this.createActionHeader()

        this.first = (this.PAGE_SIZE * (this.currentPage - 1)) +1
        this.last  = this.rowData.length + (this.PAGE_SIZE * (this.currentPage - 1))
        this.changeDetectorRef.detectChanges()
        this.resizeWidthScroll()
        this.gridApi.sizeColumnsToFit();
      },
      error: (resp) => {
        this.changeLoading(false)
        this.notiService.showNoti(resp, 'error')
      }
    })
  }

  createDefaultHeader():void {
     this.columnDefs = [
        {
          headerName: this.trans('NO'),
          lockPosition: true,
          suppressMovable: true,
          pinned: 'left',
          minWidth: 60,
          maxWidth: 60,
          cellStyle: {
            ...this.cellStyle,
            'padding': '19px'
          },
          valueGetter: param => {
            return param.node.rowIndex + (((this.currentPage - 1) * this.PAGE_SIZE) + 1)
          }
        },
        {
          headerName: this.trans('YEAR'),
          field: 'year',
          pinned: 'left',
          suppressMovable: true,
          minWidth: 154,
          maxWidth: 154,
          cellStyle: {
            ...this.cellStyle,
            'font-weight': '700'
          }
        },
        {
          headerName: this.trans('NUMBER_SEMESTER'),
          field: "semesterAmount",
          pinned: 'left',
          suppressMovable: true,
          minWidth: 100,
          maxWidth: 100,
          cellStyle: {
            ...this.cellStyle,
            'font-weight': '700',
            'padding': '18px 30px'
          }
        }
    ]
  }

  createSemesterHeader():void {

    if (this.semesterAmount < 2) {
    }

    for (let index = 0; index < this.semesterAmount; index++) {

      // column start
      const start = {
        headerName: `${this.trans('START_SEMESTER')} `+ (index === 3 ? 'IV' : 'I'.repeat(index+1)),
        cellStyle: this.cellStyle,
        minWidth: 200,
        suppressMovable: true,
        valueGetter: param => {
          if (param.data.semesters.length <= index) {
            return '';
          }

          return this.formatDate(param.data.semesters[index].from_date)
        },
      }

      // column end
      const end = {
        headerName: `${this.trans('END_SEMESTER')} `+ (index === 3 ? "IV" : "I".repeat(index+1)),
        cellStyle:this.cellStyle,
        minWidth: 200,
        suppressMovable: true,
        valueGetter: param => {
          if (param.data.semesters.length <= index) {
            return '';
          }
          return this.formatDate(param.data.semesters[index].to_date)
        },
      }

      this.columnDefs.push(start)
      this.columnDefs.push(end)
    }
  }


  createActionHeader():void {
    this.columnDefs.push({
      headerName: '',
      suppressMovable: true,
      minWidth: 50,
      maxWidth: 50,
      cellRendererFramework: ActionShoolYearComponent,
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
  }

  widthFirstThreeColumns = 314
  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    this.removeStyle();

  }

  ngAfterViewInit(): void {

  }

  resizeWidthScroll(): void {
    const scroll = (document.querySelector('.ag-body-horizontal-scroll-container') as HTMLElement)
    const allSemesterColumns = (document.querySelector('.ag-header-container') as HTMLElement)
    scroll.style.width = `${allSemesterColumns.offsetWidth + this.widthFirstThreeColumns }px`
  }

  openCreateSchoolYear(): void {
    const matDialogRef = this.dialog.open(CreateSchoolYearComponent, {
      panelClass: 'school-year',
      width: this.POPUP_WIDTH,
      height: this.POPUP_HEIGHT
    })

    matDialogRef.afterClosed().subscribe(() => {
      this.ngOnInit()
    })
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0'+date.getDate()).slice(-2)}/${('0'+(date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
  }

  page(page: number): void {
    this.currentPage = page
    this.loadData()
  }

  getTheMostSemesterAmount(): any {
    return this.rowData.reduce((x,y) => {
      return x.semesterAmount > y.semesterAmount ? x : y;
    })
  }

  prev(): void {
    this.currentPage--
    if (this.currentPage < 1) {
      this.currentPage = 1
      return
    }

    this.page(this.currentPage)
  }

  next(): void {
    this.currentPage++
    if (this.currentPage > this.totalPage) {
      this.currentPage = this.totalPage
      return
    }

    this.page(this.currentPage)
  }

  trans(key): string {
    return this.translate.instant(`SCHOOL_YEAR.GRID.${key}`)
  }

  changeLoading(open) {
    this.isLoading = open
    this.changeDetectorRef.detectChanges()
  }
  removeStyle() {
    var removeStyle :any = document.getElementsByClassName('ag-center-cols-container');
    var currentValue =  removeStyle[0].style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 16;
    removeStyle[0].style.width=`${newValue}px`;

 }
}
