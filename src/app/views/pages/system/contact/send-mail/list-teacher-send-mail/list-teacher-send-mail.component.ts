import {ChangeDetectorRef, Component, Inject, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {BtnCellRendererComponent} from "../../contact-group/create-group/btn-cell-renderer.component";
import {CommonServiceService} from "../../../../../../core/service/utils/common-service.service";
import { NO_ROW_GRID_TEMPLATE } from 'src/app/helpers/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-list-teacher-send-mail',
  templateUrl: './list-teacher-send-mail.component.html',
  styleUrls: ['./list-teacher-send-mail.component.scss']
})
export class ListTeacherSendMailComponent implements OnInit {
  gridApi: any;
  gridColumnApi: any;
  rows = [];
  rowsToDisplay = [];
  page = 1;
  pageSize = 10;
  removeItems = [];
  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  columnDefs = [
    {
      headerName: this.translate.instant('COMMON.NO'),
      field: 'make',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 50,
      maxWidth: 50,
      headerClass: 'stt-header',
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
      headerName: this.translate.instant('CONTACT.SEND_MAIL.LIST_TEACHER.GRID.TEACHER_CODE'),
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
      tooltipField: 'isTeacher',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant('CONTACT.SEND_MAIL.LIST_TEACHER.GRID.TEACHER_NAME'),
      field: 'teacherName',
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
      minWidth: 180,
      tooltipField: 'teacherName',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant('CONTACT.SEND_MAIL.LIST_TEACHER.GRID.UNIT'),
      field: 'groupName',
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
      minWidth: 250,
      tooltipField: 'groupName',
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
  first = 1;
  last = 10;
  totalPage = 0;
  rangeWithDots: any = [];
  searchText = '';
  rowFiltered: any = [];

  constructor(public ref: MatDialogRef<ListTeacherSendMailComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any = [],
              private toast: ToastrService,
              private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private translate : TranslateService
  ) { }

  ngOnInit(): void {
    this.rows = JSON.parse(JSON.stringify(this.data));
    console.log(this.rows);
    this.setRowToDisplay();
  }
  setRowToDisplay(search? :boolean) {
    if (search) {
      this.page = 1;
    }
    this.rowFiltered = this.rows.filter(row => row.text.toLowerCase().includes(this.searchText.trim().toLowerCase()));
    this.rowsToDisplay = this.rowFiltered.slice((this.page - 1) * this.pageSize,this.page * this.pageSize);
    console.log(this.rowsToDisplay)
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
      this.gridApi.sizeColumnsToFit()
    }, 50);
  }
  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit()
    }, 100)
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

  /* PAGING END */
  removeItem(api: any): void {
    this.removeItems.push(api.data.isTeacher);
    const index = this.rows.findIndex(r => r.isTeacher === api.data.isTeacher);
    this.rows.splice(index, 1);
    this.setRowToDisplay();
    // this.gridApi.updateRowData({ remove: [api.data] });
    }
}
