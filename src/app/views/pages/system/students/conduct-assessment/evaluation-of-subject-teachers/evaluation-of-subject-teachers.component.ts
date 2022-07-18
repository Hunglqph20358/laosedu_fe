import { forEach } from 'ag-grid-community/dist/lib/utils/array';
import { style } from '@angular/animations';
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
import {EvaluateConductService} from '../../../../../../core/service/service-model/evaluate-conduct.service';
import {NO_ROW_GRID_TEMPLATE} from '../../../../../../helpers/constants';
import { ColumnResizedEvent } from 'ag-grid-community';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-evaluation-of-subject-teacher',
  templateUrl: './evaluation-of-subject-teachers.component.html',
  styleUrls: ['./evaluation-of-subject-teachers.component.scss'],
})
export class EvaluationOfSubjectTeachersComponent
  implements OnInit, ICellRendererAngularComp
{

  constructor(
    private modalService: BsModalService,
    private commonService: CommonServiceService,
    private manageContactService: ManageContactService,
    private toastr: ToastrService,
    private evaluateConductService: EvaluateConductService,
    private translate: TranslateService,
  ) {}
  modalRef: BsModalRef;


  cellValue;
  ROW_HEIGHT = 56;
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
      headerName: this.translate.instant(`CONDUCT_ASSESSMENT.NUMBER`),
      headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.NUMBER`),
      headerClass: 'sy-header-center',
      valueGetter: param => {
        return param.node.rowIndex + (((this.currentPage - 1) * this.perPage) + 1)
      },
      // field: 'index',
      // tooltipField: 'index',
      minWidth: 48,
      maxWidth: 48,
      cellStyle: {
        ...this.cellStyle,
        // 'justify-content': 'center',
        'text-align':'center',
        left:'9px !important'
      },
    },
    {
      headerName: this.translate.instant(`CONDUCT_ASSESSMENT.SUBJECT`),
      headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.SUBJECT`),
      // headerClass: 'sy-header-center',
      field: 'subjectName',
      tooltipField: 'subjectName',
      minWidth: 150,
      // maxWidth:150,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER`),
      headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.SEMESTER`),
      headerClass: 'sy-header-center',
      field: 'semester',
      tooltipField: 'semester',
      minWidth: 120,
      // maxWidth:100,
      cellStyle: {
        ...this.cellStyle,
        'justify-content':'center',
      },
    },
    {
      headerName: this.translate.instant(`CONDUCT_ASSESSMENT.TEACHER_TEACHING`),
      headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.TEACHER_TEACHING`),
      // headerClass: 'sy-header-center',
      field: 'teacherName',
      tooltipField: 'teacherName',
      minWidth: 150,
      // maxWidth:150,
      cellStyle: {
        ...this.cellStyle,
      },
    },
    {
      headerName: this.translate.instant(`CONDUCT_ASSESSMENT.EVALUATE_OF_TEACHER1`),
      headerTooltip: this.translate.instant(`CONDUCT_ASSESSMENT.EVALUATE_OF_TEACHER1`),
      // headerClass: 'sy-header-center',
      field: 'evaluateContent',
      cellRenderer: params =>{
          // return `${(this.getLength(params.value) < 40)?params.value:(params.value.substring(0,40)+"...")}`
        return `<span style="height: 56px; padding-bottom: 15px;">
              ${params.value}
            </span>`
        // return `<span style="height: 56px">
        //       123hdhhdhf jdhfjdfhd jdhfdfshd jdfhjdfg bjdfhdjsfhd jdhfjdfjfb jdfhjdfbd jdhfjdfd jdhf
        //        jdfndjd djfdjfh jdfhdfgdshf jdfhdfvdh dhfgdfvs dhgfdsfbn uhfssdjkfbds djkhfdsjkf
        //        jhfdf djfbdsf jdkfdhfv jdhfudbf jdfgdfb dkfhdjkfb fdkjfhjfb fhjkfb jfhjfgb
        //        fjdf dfhdjf difhjdfbdj dkfhdfb dklfhd dklfhdsislh
        //     </span>`
      },

      tooltipField: 'evaluateContent',
      minWidth: 350,
      // maxWidth:1000,
      cellStyle: {
        // ...this.cellStyle,
        'font-style': 'normal',
        'font-size': '12px',
        color: '#101840',
        // 'align-items': 'center',
        display: 'flex',
        'font-weight': '500',
        'font-family': 'Inter',
        // 'white-space': 'pre-wrap',
        'white-space': 'pre-line',
        overflow: 'auto',
        height:'56px',
        width:'656px',
        'line-height': '17px',
      },
      // cellRenderer: (params) => this.limitStringCellValue(params),
    },
  ];
  defaultColDef = {
    lockPosition: true,
    suppressMenu: true,
  };

  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  rowData = [];

  perPage = 10;
  currentPage = 1;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  rangeWithDots = [];

  gridApi;
  gridColumnApi;

//    removeClassName($event) {
//      //var mainElement  =  Array.from(document.getElementsByClassName('modal-content') as HTMLCollectionOf<HTMLElement>);
//      //var eGridDiv = Array.from(document.getElementsByClassName('ag-horizontal-right-spacer') as HTMLCollectionOf<HTMLElement>);
//     //  var scrollElement = Array.from(document.getElementsByClassName('ag-body-horizontal-scroll-viewport') as HTMLCollectionOf<HTMLElement>)
//     // // var scroll = Array.from(document.getElementsByClassName('ag-body-horizontal-scroll') as HTMLCollectionOf<HTMLElement>);
//     //  //var scrollE = Array.from(document.getElementsByClassName('ag-center-cols-viewport') as HTMLCollectionOf<HTMLElement>);
//     //  //var scrollDontNeed = Array.from(document.getElementsByClassName('ag-body-horizontal-scroll-container') as HTMLCollectionOf<HTMLElement>);
//     //  //var scrollLeftDontNeed = Array.from(document.getElementsByClassName('ag-horizontal-left-spacer') as HTMLCollectionOf<HTMLElement>);

//     // //  eGridDiv.forEach((item =>{

//     // //    //item.removeAttribute('style');
//     // //     item.remove();
//     // //  }));
//     //  scrollElement.forEach((item) =>{
//     //    //item.classList.remove('ag-body-horizontal-scroll-viewport');
//     //    item.removeAttribute('style');
//     //  })
//     //  scrollDontNeed.forEach((item) =>{
//     //   //item.classList.remove('ag-body-horizontal-scroll-viewport');
//     //   item.removeAttribute('style');
//     // })
//     // scrollLeftDontNeed.forEach((item) =>{
//     //   //item.classList.remove('ag-body-horizontal-scroll-viewport');
//     //   item.remove();
//     // })
//     //  scroll.forEach((item) =>{
//     //    item.remove();
//     //  })
//     //  scrollE.forEach((item) =>{
//     //   // item.classList.remove('ag-center-cols-viewport');
//     //    item.classList.add('auto-viewport');
//     //    //item.style.height='200%';

//     //  })
// }

  limitStringCellValue = (params) => {
    const element = document.createElement('span');
    element.className = 'one-line-ellipsis w-100';
    element.appendChild(document.createTextNode(params.value));
    return element;
  };
  onGridReady(params) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      this.removeStyle();
    }, 50);

  }

  ngOnInit() {
    // setTimeout(this.removeStyle,2000);
  }

  // gets called once before the renderer is used
  // showEvaluation = true;
  agInit(params): void {
    console.log('param teacher',params);
    this.cellValue = params.data;
    // if (this.cellValue.evaluate.toString().trim() === '') {
    //   this.showEvaluation = false;
    // }
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true;
  }
  // get length of unicode string
  getLength(str){
    return [...str].length;
  }

  loadData(page: number){
    this.currentPage = page;
    const dataGetEvaluate = {
      years:this.cellValue.currentYear,
      semester: this.cellValue.semester,
      classCode: this.cellValue.classCode,
      studentCode: this.cellValue.studentCode,
      pageSize:this.perPage,
      currentPage:this.currentPage,
    };
    this.evaluateConductService
      .getTeacherEvaluate(dataGetEvaluate)
      .subscribe({
        next: (teacherEvaluateResponse) => {
          console.log('teacherEvaluateResponse', teacherEvaluateResponse);

          this.rowData = teacherEvaluateResponse.lstData;
          // this.rowData.forEach((item) =>{
          //   if(item.evaluateContent.length == 50){
          //       // Add class text overflow
          //   }
          // })
          const totalElements = teacherEvaluateResponse.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.last =
              this.rowData.length + this.perPage * (this.currentPage - 1);
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
          setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
          }, 50);
        }
      });
  }

  openEvaluationModal(template: TemplateRef<any>) {
    const dataGetEvaluate = {
      years:this.cellValue.currentYear,
      semester: this.cellValue.semester,
      classCode: this.cellValue.classCode,
      studentCode: this.cellValue.studentCode,
      pageSize:this.perPage,
      currentPage:this.currentPage,
    };

    console.log('dataGetEvaluate',dataGetEvaluate);

    this.evaluateConductService
      .getTeacherEvaluate(dataGetEvaluate)
      .subscribe({
        next: (teacherEvaluateResponse) => {
          console.log('teacherEvaluateResponse', teacherEvaluateResponse);

          this.rowData = teacherEvaluateResponse.lstData;
          const totalElements = teacherEvaluateResponse.totalRecord;

          if (totalElements > 0) {
            this.total = totalElements;
            this.totalPage = Math.ceil(this.total / this.perPage);
            this.rangeWithDots = this.commonService.pagination(
              this.currentPage,
              this.totalPage
            );
            this.first = this.perPage * (this.currentPage - 1) + 1;

            this.last =
              this.rowData.length + this.perPage * (this.currentPage - 1);
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

          // console.log(`this.rowData`, this.rowData);
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
      setInterval(this.removeStyle,1000);
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  // goToPage(page: number) {
  //   if (page !== this.currentPage && page >= 1 && page <= this.totalPage) {
  //     this.currentPage = page;
  //     this.rangeWithDots = this.commonService.pagination(
  //       this.currentPage,
  //       this.totalPage
  //     );
  //     this.first = this.perPage * (this.currentPage - 1) + 1;
  //     this.last = this.first + this.perPage - 1;
  //     if(this.last > this.total){
  //       this.last = this.total;
  //     }
  //     // this.rowData = this.contacts.slice(this.first - 1, this.last);
  //     // console.log(`this.contacts`, this.contacts);
  //     // console.log(`this.rowData`, this.rowData);
  //     // console.log(`this.first`, this.first);
  //     // console.log(`this.last`, this.last);
  //     // console.log(`this.perPage`, this.perPage);
  //
  //     // this.gridApi.setRowData(this.rowData);
  //     // this.gridApi.sizeColumnsToFit();
  //   }
  // }

  gridSizeChanged(params) {
    setTimeout( () => {
      params.api.sizeColumnsToFit(),
        this.removeStyle()
    }, 500)
  }

  removeStyle() {
    var removeStyle = Array.from(document.getElementsByClassName('ag-center-cols-container') as HTMLCollectionOf<HTMLElement>);
    removeStyle[1].style.removeProperty('width');
    removeStyle[1].style.width=`100% !important`;
  }

}
