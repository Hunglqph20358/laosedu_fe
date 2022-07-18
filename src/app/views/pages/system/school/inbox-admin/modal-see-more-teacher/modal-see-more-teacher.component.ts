import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CommonServiceService} from '../../../../../../core/service/utils/common-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-modal-see-more-teacher',
  templateUrl: './modal-see-more-teacher.component.html',
  styleUrls: ['./modal-see-more-teacher.component.scss']
})
export class ModalSeeMoreTeacherComponent implements OnInit, OnDestroy {
  gridApi: any;
  gridColumnApi: any;
  rows = [];
  rowsToDisplay = [];
  page = 1;
  pageSize = 10;
  removeItems = [];
  columnDefs = [];
  first = 1;
  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  last = 10;
  totalPage = 0;
  rangeWithDots: any = [];
  searchText = '';
  rowFiltered: any = [];
  receivedType = null;
  form: FormGroup;
  destroy$ = new Subject();
  constructor(public ref: MatDialogRef<ModalSeeMoreTeacherComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private toast: ToastrService,
              private matDialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonServiceService,
              private formBuilder: FormBuilder,
              private translate : TranslateService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.rows = JSON.parse(JSON.stringify(this.data.data));
    this.receivedType = JSON.parse(JSON.stringify(this.data.type));

    if (this.receivedType === 1) {
      this.columnDefs = [
        {
          headerName: this.translate.instant('COMMON.NO'),
          field: 'make',
          valueGetter: param => {
            return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1);
          },
          maxWidth: 50,
          cellStyle: {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'justify-content': 'center',
            color: '#101840',
            display: 'flex',
          },
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.STUDENT_CODE'),
          field: 'code',
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
          width: 100,
          tooltipField: 'code',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.STUDENT_NAME'),
          field: 'name',
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
          width: 120,
          tooltipField: 'name',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.PHONE'),
          field: 'parentPhoneNumber',
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
          width: 120,
          tooltipField: 'parentPhoneNumber',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.CLASS'),
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
          width: 100,
          tooltipField: 'className',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.YEAR'),
          field: 'schoolYear',
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
          width: 100,
          tooltipField: 'schoolYear',
          suppressMovable: true,
          // resizable: true
        }
      ];
    } else {
      this.columnDefs = [
        {
          headerName: this.translate.instant('COMMON.NO'),
          field: 'make',
          valueGetter: param => {
            return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1);
          },
          maxWidth: 50,
          cellStyle: {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'justify-content': 'center',
            color: '#101840',
            display: 'flex',
          },
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.TEACHER_CODE'),
          field: 'code',
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
          maxWidth: 120,
          tooltipField: 'code',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.TEACHER_NAME'),
          field: 'name',
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
          maxWidth: 300,
          tooltipField: 'name',
          suppressMovable: true,
          // resizable: true
        },
        {
          headerName: this.translate.instant('INBOX_ADMIN.MODAL.DEPARTMENT'),
          field: 'deptName',
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
          maxWidth: 300,
          tooltipField: 'deptName',
          suppressMovable: true,
          // resizable: true
        }
      ];
    }
    this.setRowToDisplay();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      searchText: [''],
    });

    // this.form.get('searchText').valueChanges.pipe(
    //   debounceTime(1000),
    //   takeUntil(this.destroy$)
    // ).subscribe(() => this.setRowToDisplay())
  }

  setRowToDisplay() {
    let searchText: string = this.form.value.searchText
    if (searchText) {
      searchText = searchText.trim().toLowerCase();
      this.rowFiltered = this.rows.filter(it => (it.code && it.code.toLowerCase().indexOf(searchText) > -1)
        || (it.name && it.name.toLowerCase().indexOf(searchText) > - 1));
    } else {
      this.rowFiltered = this.rows;
    }
    this.rowsToDisplay = this.rowFiltered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    if (this.rowsToDisplay.length === 0 && this.page > 1) {
      this.page--;
      this.setRowToDisplay();
    } else {
      this.first = this.rowsToDisplay.length === 0 ? 0: ((this.page - 1) * this.pageSize) + 1;
      this.last = this.rowsToDisplay.length === 0 ? 0 : (this.first + this.rowsToDisplay?.length - 1);
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
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  /* PAGING START */
  goToPage(page: number): void {
    this.page = page;
    this.setRowToDisplay();
  }

  prev(): void {
    this.page = --this.page;
    if (this.page < 1) {
      this.page = 1;
    }
    this.setRowToDisplay();
  }

  next(): void {
    this.page = ++this.page;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
    }
    this.setRowToDisplay();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
