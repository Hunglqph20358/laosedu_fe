import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { ManageContactService } from 'src/app/core/service/service-model/manage-contact.service';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'kt-history-contact-package',
  templateUrl: './history-contact-package.component.html',
  styleUrls: ['./history-contact-package.component.scss'],
})
export class HistoryContactPackageComponent
  implements OnInit, ICellRendererAngularComp
{
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private commonService: CommonServiceService,
    private manageContactService: ManageContactService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ManageContactComponent;

  cellValue;
  ROW_HEIGHT = 50;
  HEADER_HEIGHT = 56;
  cellStyle = {
    'font-style': 'normal',
    'font-size': '12px',
    'line-height': '20px',
    color: '#101840',
    'align-items': 'center',
    display: 'flex',
    'font-weight': '500',
    'font-family': 'Inter',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  };

  columnDefs = [
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.NUMBER`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.NUMBER`),
      headerClass: 'sy-header-center',
      field: 'index',
      tooltipField: 'index',
      minWidth: 50,
      maxWidth: 50,
      cellStyle: {
        ...this.cellStyle,
        'justify-content': 'center',
      },
    },
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.CREATE_DATE`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.CREATE_DATE`),
      field: 'createDate',
      tooltipField: 'createDate',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.ACTION`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.ACTION`),
      field: 'action',
      tooltipField: 'action',
      minWidth: 130,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.PACKAGE_NAME`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.PACKAGE_NAME`),
      field: 'packageName',
      tooltipField: 'packageName',
      minWidth: 100,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.CREATOR`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.CREATOR`),
      field: 'creator',
      tooltipField: 'creator',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`MANAGE_CONTACT.ACTIVE_DATE`),
      headerTooltip: this.translate.instant(`MANAGE_CONTACT.ACTIVE_DATE`),
      field: 'activeDate',
      tooltipField: 'activeDate',
      minWidth: 120,
      cellStyle: {
        ...this.cellStyle,
      },
    },
  ];
  defaultColDef = {
    lockPosition: true,
    suppressMenu: true,
  };

  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  rowData = [];

  perPage = 3;
  currentPage = 1;
  first = 1;
  last = 3;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  gridApi;
  gridColumnApi;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  ngOnInit() {}

  // gets called once before the renderer is used
  showHistory = true;
  agInit(params): void {
    console.log('check data before ren history',params.data);
    this.cellValue = params.data;
    if (this.cellValue.status1 === 0 && this.cellValue.status2 === 0 && this.cellValue.status3 === 0 && this.cellValue.status4 === 0
      && this.cellValue.statusFullYear === 0) {
      this.showHistory = false;
    }
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true;
  }

  contacts;
  creatorMapping = {
    2: this.translate.instant(`MANAGE_CONTACT.PARENTS`),
    1: this.translate.instant(`MANAGE_CONTACT.SCHOOL`),
  };
  actionsMapping = {
    0: this.translate.instant(`MANAGE_CONTACT.CANCEL_SERVICE`),
    1: this.translate.instant(`MANAGE_CONTACT.REGISTER_PACKAGE`),
  };
  openHistoryModal(template: TemplateRef<any>) {
    const dataHistory = {
      studentCode: this.cellValue.studentCode,
      shoolYear: this.cellValue.currentYear,
      pageSize:this.perPage,
      // page:this.currentPage,
      page:1,
    };
    console.log('dataHistory',dataHistory);

    this.manageContactService
      .getHistoryPackageByStudent(dataHistory)
      .subscribe({
        next: (historyResponse) => {
          console.log('historyResponse', historyResponse);

          const contacts = historyResponse.data.registerPackageDetailsDTOList;
          const totalElements = historyResponse.data.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.contacts = contacts.map((contact, _index) => {
              const singleRowData = {
                index: this.first + _index,
                createDate: moment(contact.create_date).format('DD/MM/YYYY'),
                action: this.actionsMapping[contact.action],
                packageName: contact.dataPackageName,
                creator: this.creatorMapping[+contact.creator],
                activeDate: moment(contact.activeDate).format('DD/MM/YYYY'),
              };

              return singleRowData;
            });

            // this.rowData = this.contacts.slice(this.first - 1, this.last);
            this.rowData = this.contacts;
            this.last =
                this.rowData.length + this.perPage * (this.currentPage - 1);
            if(this.last - this.first >2){
              this.last = this.first+2;
            }

            if(this.last > this.total){
              this.last = this.total;
            }
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }

          console.log(`this.rowData`, this.rowData);
          // this.gridApi.setRowData(this.rowData);
          // this.gridApi.sizeColumnsToFit();

          this.modalRef = this.modalService.show(
            template,
            Object.assign(
              {},
              {
                class:
                  'action-history-package-contact',
              }
            )
          );
        },
        error: (res) => {
          alert(res);
        },
      });
  }

  goToPage(page: number) {
    // if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
    //   this.currentPage = page;
    //   this.rangeWithDots = this.commonService.pagination(
    //     this.currentPage,
    //     this.totalPage
    //   );
    //   this.first = this.perPage * (this.currentPage - 1) + 1;
    //   this.last = this.first + this.perPage - 1;
    //   if(this.last > this.total){
    //     this.last = this.total;
    //   }
    //   this.rowData = this.contacts.slice(this.first - 1, this.last);


      if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
        this.currentPage = page;
        this.loadData(page);
      }
      // console.log(`this.contacts`, this.contacts);
      // console.log(`this.rowData`, this.rowData);
      // console.log(`this.first`, this.first);
      // console.log(`this.last`, this.last);
      // console.log(`this.perPage`, this.perPage);

      // this.gridApi.setRowData(this.rowData);
      // this.gridApi.sizeColumnsToFit();
    // }
  }

  loadData(page: number){
    this.currentPage = page;
    const dataHistory = {
      studentCode: this.cellValue.studentCode,
      shoolYear: this.cellValue.currentYear,
      pageSize:this.perPage,
      page:this.currentPage,
    };
    this.manageContactService
      .getHistoryPackageByStudent(dataHistory)
      .subscribe({
        next: (historyResponse) => {
          console.log('historyResponse', historyResponse);

          const contacts = historyResponse.data.registerPackageDetailsDTOList;
          const totalElements = historyResponse.data.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.contacts = contacts.map((contact, _index) => {
              const singleRowData = {
                index: this.first + _index,
                createDate: moment(contact.create_date).format('DD/MM/YYYY'),
                action: this.actionsMapping[contact.action],
                packageName: contact.dataPackageName,
                creator: this.creatorMapping[+contact.creator],
                activeDate: moment(contact.activeDate).format('DD/MM/YYYY'),
              };

              return singleRowData;
            });

            // this.rowData = this.contacts.slice(this.first - 1, this.last);
            this.rowData = this.contacts;
            this.last =
              this.rowData.length + this.perPage * (this.currentPage - 1);
            if (this.last - this.first > 2) {
              this.last = this.first + 2;
            }

            if (this.last > this.total) {
              this.last = this.total;
            }
          } else {
            this.total = 0;
            this.rangeWithDots = [];
            this.first = 0;
            this.last = 0;
            this.rowData = [];
          }

          console.log(`this.rowData`, this.rowData);
          // this.gridApi.setRowData(this.rowData);
          // this.gridApi.sizeColumnsToFit();

        }
      });
  }
}
