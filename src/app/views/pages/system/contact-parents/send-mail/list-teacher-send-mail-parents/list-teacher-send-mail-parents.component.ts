import {ChangeDetectorRef, Component, Inject, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CommonServiceService} from "../../../../../../core/service/utils/common-service.service";
import {BtnCellRendererComponent} from "../../../contact/contact-group/create-group/btn-cell-renderer.component";
import {NO_ROW_GRID_TEMPLATE} from "../../../../../../helpers/constants";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-list-teacher-send-mail-parents',
  templateUrl: './list-teacher-send-mail-parents.component.html',
  styleUrls: ['./list-teacher-send-mail-parents.component.scss'],
})
export class ListTeacherSendMailParentsComponent implements OnInit {
  columnDefs = [
    {
      headerName: this.translate.instant('COMMON.NO'),
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 48,
      maxWidth: 48,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'justify-content': 'center',
        color: '#101840',
        display: 'flex',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.STUDENT_CODE'),
      headerTooltip: this.trans('GRID.STUDENT_CODE'),
      field: 'isTeacher',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#3366FF',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden'
      },
      minWidth: 120,
      maxWidth: 150,
      tooltipField: 'isTeacher',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.STUDENT_NAME'),
      headerTooltip: this.trans('GRID.STUDENT_NAME'),
      field: 'fullName',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 150,
      maxWidth: 170,
      tooltipField: 'fullName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.PHONE'),
      headerTooltip: this.trans('GRID.PHONE'),
      field: 'phone',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 130,
      maxWidth: 130,
      tooltipField: 'phone',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.CLASS'),
      headerTooltip: this.trans('GRID.CLASS'),
      field: 'className',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 65,
      maxWidth: 100,
      tooltipField: 'className',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.GRADE'),
      headerTooltip: this.trans('GRID.GRADE'),
      field: 'grade.name',
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      minWidth: 80,
      maxWidth: 100,
      tooltipField: 'grade.name',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.trans('GRID.SENT_AMOUNT'),
      headerTooltip: this.trans('GRID.SENT_AMOUNT'),
      headerClass: 'sent-amount-header',
      field: 'numberSms',
      valueFormatter: params => {
        return params.value ? params.value : 0;
      },
      tooltipValueGetter: params => {
        return params.value ? params.value : 0;
      },
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'justify-content': 'center',
        'display': 'flex',
        color: '#101840',
        // top: '12px',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'border-right': 'none'
      },
      // headerComponentParams:{
      //   template:'<span style="font-size:10px; color:#8f95b2; align-items: left";>' +
      //     '<div style="text-align: center; margin-bottom: 6px">' + this.trans('GRID.AMOUNT')+ '</div>' +
      //     '<div style="text-align: center">'+this.trans('GRID.SENT')+'</div> ' +
      //     '</span>',
      // },
      minWidth: 96,
      maxWidth: 96,
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: '',
      field: '',
      cellRendererFramework: BtnCellRendererComponent,
      cellRendererParams: {
        clicked: this.removeItem.bind(this)
      },
      minWidth: 48,
      maxWidth: 48,
      suppressMovable: true,
    },
  ];
  gridApi: any;
  gridColumnApi: any;
  rows = [];
  rowsToDisplay = [];
  page = 1;
  pageSize = 10;
  removeItems = [];
  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  first = 1;
  last = 6;
  totalPage = 0;
  rangeWithDots: any = [];
  searchText = '';
  rowFiltered: any = [];
  totalRecord = 0;

  constructor(public ref: MatDialogRef<ListTeacherSendMailParentsComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any = [],
              private toast: ToastrService,
              private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.rows = JSON.parse(JSON.stringify(this.data));
    this.rows = this.rows.map(row => {
      return {...row, ...row.data};
    });
    console.log(this.rows);
    this.setRowToDisplay();
  }
  setRowToDisplay(search? :boolean) {
    if (search) {
      this.page = 1;
    }
    this.rowFiltered = this.rows.filter(row => row.text.toLowerCase().includes(this.searchText.trim().toLowerCase()));
    this.totalRecord = this.rowFiltered.length;
    this.rowsToDisplay = this.rowFiltered.slice((this.page - 1) * this.pageSize,this.page * this.pageSize);
    // console.log(this.rowsToDisplay)
    if (this.rowsToDisplay.length === 0 && this.page > 1) {
      this.page--;
      this.setRowToDisplay();
    } else {
      this.first = ((this.page - 1) * this.pageSize) + 1;
      this.last = this.first + this.rowsToDisplay?.length - 1;
      this.totalPage = Math.ceil(this.rowFiltered?.length / this.pageSize);
      this.rangeWithDots = this.commonService.pagination(
        this.page,
        this.totalPage
      );
      this.changeDetectorRef.detectChanges();
    }
  }

  onGridReady(params) {
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      // this.gridApi.sizeColumnsToFit();
      this.removeStyle();
    }, 50);
  }
  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit();
      this.removeStyle();
    }, 100)
  }

  removeStyle() {
    var removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
    var currentValue =  removeStyle.style.getPropertyValue('width');
    var newCurrentValueFloat = currentValue.slice(0,-2);
    var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    var newValue = newCurrentValueInt + 17;
    removeStyle.style.width=`${newValue}px`;

 }
  /* PAGING START */
  goToPage(page: number): void {
    this.page = page;
    this.setRowToDisplay()
  }

  prev(): void {
    this.page = --this.page;
    if (this.page < 1) {
      this.page = 1
    }
    this.setRowToDisplay()
  }

  next(): void {
    this.page = ++this.page
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
    }
    this.setRowToDisplay()
  }

  trans(KEY: string, params?) : string {
      return this.translate.instant(`PARENT_CONTACT.SEND_MAIL.LIST_TEACHER.${KEY}`, params)
  }

  /* PAGING END */
  removeItem(api: any): void {
    this.removeItems.push(api.data.isTeacher);
    const index = this.rows.findIndex(r => r.isTeacher === api.data.isTeacher);
    this.rows.splice(index, 1);
    this.setRowToDisplay();
    // this.gridApi.updateRowData({ remove: [api.data] });
  }
}
