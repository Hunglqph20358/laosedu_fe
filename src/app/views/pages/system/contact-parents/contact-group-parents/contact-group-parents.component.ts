import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ContactGroupService} from '../../../../../core/service/service-model/contact-group.service';
import {GroupTeacherModel} from '../../../../../core/service/model/group-teacher.model';
import {CommonServiceService} from '../../../../../core/service/utils/common-service.service';
import {NO_ROW_GRID_TEMPLATE, TABLE_CELL_STYLE} from '../../../../../helpers/constants';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {DeleteClassRoomComponent} from '../../class-room/delete-class-room/delete-class-room.component';
import {MatDialog} from '@angular/material/dialog';
import {TreeviewItem} from 'ngx-treeview';
import {Router} from "@angular/router";
import {ViewDetailGroupParentsComponent} from "./view-detail-group-parents/view-detail-group-parents.component";
import {CreateGroupParentsComponent} from "./create-group-parents/create-group-parents.component";
import {ContactGroupParentService} from "../../../../../core/service/service-model/contact-parent-group.service";
import {ClassroomService} from "../../../../../core/service/service-model/classroom.service";
import {GroupActionParentsComponent} from "./group-action-parents/group-action-parents.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-contact-group-parents',
  templateUrl: './contact-group-parents.component.html',
  styleUrls: ['./contact-group-parents.component.scss']
})
export class ContactGroupParentsComponent implements OnInit {
  @ViewChild('searchContactGroup') private elementRef: ElementRef;
  contactGroupList: GroupTeacherModel[] = [];
  headerHeight = 56;
  rowHeight = 50;
  gridApi;
  gridColumnApi;
  rowCheckedList: any = [];
  columnDefs = [
    {
      headerName: '',
      field: 'refunded',
      aggFunc: 'sum',
      minWidth: 40,
      maxWidth: 40,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressMovable: true,
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.NUMBER`),
      field: 'make',
      headerClass: 'sy-header-center',
      valueGetter: param => {
        return param.node.rowIndex + (((this.page - 1) * this.pageSize) + 1)
      },
      minWidth: 48,
      maxWidth: 48,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#101840',
        display: 'flex',
        'justify-content': 'center',
      },
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.GROUP_CODE`),
      headerClass: 'upper',
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
      minWidth: 120,
      tooltipField: 'code',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.GROUP_NAME`),
      headerClass: 'upper',
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
      minWidth: 450,
      tooltipField: 'name',
      suppressMovable: true,
      resizable: true
    },
    {
      headerName: this.translate.instant(`PARENT_CONTACT.LIST_PARENTS_STUDENT`),
      minWidth: 150,
      suppressMovable: true,
      cellRendererFramework: ViewDetailGroupParentsComponent,
      cellStyle: {...TABLE_CELL_STYLE, color: '#3366FF'},
      resizable: true
    },
    {
      headerName: '',
      field: '',
      cellRendererFramework: GroupActionParentsComponent,
      minWidth: 40,
      maxWidth: 40,
      cellStyle: {
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        color: '#696F8C',
        'transform': 'translateX(17px)',
      },
      suppressMovable: true,
      resizable: true
    },
  ];
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));

  totalContactGroup = 0;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];
  filterText = '';
  regexSpace = /\s(?=\s)/g;
  search: any = {
    page: 0,
    size: 0,
    keySearch: null,
    sort: null,
  };
  subscription: Subscription;
  items: any = []
  listTreeViewTeacherRaw = [];

  constructor(private contactGroupParentService: ContactGroupParentService,
              private matDialog: MatDialog,
              private toastr: ToastrService,
              private classRoomService: ClassroomService,
              private router: Router,
              private commonService: CommonServiceService,
              private changeDetectorRef: ChangeDetectorRef,
              private translate: TranslateService,
              private toast: ToastrService,) {
    if (this.router.getCurrentNavigation()?.extras?.state?.openCreateDialog) this.openAddGroupDialog('add');
  }

  ngOnInit(): void {
    this.searchGroupContact();
    this.listeningIsDelete();
    setTimeout(() => {
      this.removeStyle
    }, 1000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

  removeStyle() {
    // var removeStyle = Array.from(document.getElementsByClassName('ag-center-cols-container') as HTMLCollectionOf<HTMLElement>);
    //    var currentValue =  removeStyle[0].style.removeProperty('width');
    //    removeStyle[0].style.width=`100% !important`;
 }
  searchGroupContact() {
    if (this.filterText != null) {
      this.search.keySearch = this.filterText.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.contactGroupParentService.doSearch(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.contactGroupList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalContactGroup = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.totalPage = response.response.totalPages;
        this.first = ((this.page - 1) * this.pageSize) + 1;
        this.last = this.first + this.contactGroupList.length - 1;
        if (this.totalContactGroup % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        this.gridApi.setRowData(this.contactGroupList);
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.log(error);
      }
    );
  }

  searchGroupContactWithKeySearch(): any {
    this.pageSize = 10;
    this.page = 1;
    this.rowCheckedList = [];
    this.searchGroupContact();
  }

  searchGroupContactWithPage(pages: number) {
    if (this.search.keySearch != null) {
      this.search.keySearch = this.search.keySearch.replace(this.regexSpace, '').trim();
    }
    this.search.size = this.pageSize;
    this.search.page = this.page;
    this.search.sort = 'name,code,asc';
    this.contactGroupParentService.doSearch(this.search).subscribe(
      response => {
        // tslint:disable-next-line:no-non-null-assertion
        this.contactGroupList = response.response.content;

        // Paging
        // tslint:disable-next-line:no-non-null-assertion
        this.totalContactGroup = response.response.totalElements;
        // tslint:disable-next-line:no-non-null-assertion
        this.first = ((pages - 1) * this.pageSize) + 1;
        this.last = this.first + this.contactGroupList.length - 1;
        if (this.totalContactGroup % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        } else {
          this.totalPage = Math.floor(this.totalContactGroup / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(
            this.page,
            this.totalPage
          );
        }
        console.log(this.contactGroupList.length);
        this.gridApi.setRowData(this.contactGroupList);
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.log(error);
      }
    );
  }

  onRowSelected() {
    const listRowSelected = [];
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        listRowSelected.push(row.data);
      }
    });
    this.rowCheckedList = listRowSelected;
  }

  uncheckAll() {
    this.gridApi.forEachNode(row => {
      if (row.isSelected()) {
        row.setSelected(false);
      }
    });
  }

  onGridReady(params) {
    console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit()
      this.resizeColumns()
    }, 50);
  }

  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit(),
      this.resizeColumns()
    }, 500)
    // params.api.sizeColumnsToFit();
    this.removeStyle();
  }

  /* PAGING START */
  goToPage(page: number): void {
    this.page = page
    this.searchGroupContactWithPage(page);
    this.rowCheckedList = [];
  }

  prev(): void {
    this.page = --this.page
    if (this.page < 1) {
      this.page = 1
      return
    }
    this.searchGroupContactWithPage(this.page);
    this.rowCheckedList = [];
  }

  next(): void {
    this.page = ++this.page
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.searchGroupContactWithPage(this.page);
    this.rowCheckedList = [];
  }

  /* PAGING END */

  listeningIsDelete() {
    this.subscription = this.contactGroupParentService.delete$.subscribe(val => {
      if (val === true) {
        this.searchGroupContactWithPage(this.page);
      }
    });
  }

  deleteAll() {
    const dataConfirm = {title: this.translate.instant(`PARENT_CONTACT.TITLE_DELETE`), message: this.translate.instant(`PARENT_CONTACT.CONFIRM_DELETE`)};
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        const listGroupDelete = this.rowCheckedList;
        // Call API
        this.contactGroupParentService.deleteContactGroup({listGroupDelete}).subscribe(resAPI => {
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
          } else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
          this.contactGroupParentService.changeIsDelete(true);
          this.rowCheckedList = [];
        });
      }
    });
  }

  openAddGroupDialog(action: string): void {
    const dataCLass: any = {};
    dataCLass.action = action;
    dataCLass.listTreeViewTeacherRaw = this.listTreeViewTeacherRaw;
    dataCLass.items = this.items;
    this.matDialog.open(CreateGroupParentsComponent, {
      data: dataCLass,
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      height: '739px',
      panelClass: 'school-year'
    }).afterClosed().subscribe(res => {
    });
  }

  gridColumnsChanged(params){
    setTimeout( () => {
      params.api.sizeColumnsToFit(),
        this.resizeColumns()
    }, 500)
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  resizeColumns(): void {
    const header = (document.querySelector('.ag-header-container') as HTMLElement)
    const body = (document.querySelector('.ag-center-cols-container') as HTMLElement)
    body.style.minWidth = `${header.offsetWidth+19}px`
    console.log(body)
    console.log(header)
  }

}
