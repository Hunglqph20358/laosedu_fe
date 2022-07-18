import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, TemplateRef , Renderer2, ElementRef} from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { equals } from '@ngx-translate/core/lib/util';
import { forEach } from 'ag-grid-community/dist/lib/utils/array';
import { CommonServiceService } from 'src/app/core/service/utils/common-service.service';
import { DocumentaryService } from 'src/app/core/service/service-model/documentary.service';
import { GetData } from 'src/app/core/service/actions/school-information-action';
import {FormBuilder, FormGroup} from '@angular/forms';
import { first } from 'lodash';
import { DownloadButtonRenderComponent } from './download-button-render/download-button-render.component';
import { ActionOfficalLetterDocumentComponent } from './action-offical-letter-document/action-offical-letter-document.component';
import {environment} from '../../../../../environments/environment';
import {forkJoin} from 'rxjs';
import { saveAs } from 'file-saver';
import { CreateOfficalLetterComponent } from './create-offical-letter/create-offical-letter.component';
import { GridOptions } from 'ag-grid-community';
import {NO_ROW_GRID_TEMPLATE} from "../../../../helpers/constants";

export interface DataDropdown {
  code: string | null;
  name: string;
}

@Component({
  selector: 'kt-official-letter-document',
  templateUrl: './official-letter-document.component.html',
  styleUrls: ['./official-letter-document.component.scss']
})
export class OfficialLetterDocumentComponent implements OnInit , AfterViewInit{
  formData;
  @ViewChild('templateDocument', {static : false}) templateModal;
  @ViewChild('focus', {static : false}) focus : ElementRef<HTMLInputElement>;
  @ViewChild('myInput', {static:false}) myInput: ElementRef;

  la = localStorage.getItem('language');
  files = [];
  hide = true;
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  form1: FormGroup;
  columnDefs = [];
  rowData = [];
  noRowsTemplate =  NO_ROW_GRID_TEMPLATE.replace('{{field}}', this.translate.instant('PARENTS.NO_INFO'));
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 56;
  listDocumentType = [];
  listDocumentAdd = [];
  dropDownDefault: DataDropdown = {
    code: '',
    name: this.trans('OFFICAL_LETTER_DOCUMENT.ANYTHINGS.SELECT_FIRST')
  };
  dropDownAdd: DataDropdown = {
    code: '',
    name: this.trans('OFFICAL_LETTER_DOCUMENT.ANYTHINGS.PLACE_HOLDER')
  };
  valueDefault;
  frameworkComponents;
  currentRoles = [];
  isRole: boolean;
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;

  isCreateNew : boolean;
  listSigner = [];
  gridOptions : GridOptions;


  constructor(
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private documentaryService : DocumentaryService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private renderer : Renderer2,
    private translate: TranslateService
  ) {
    this.columnDefs = [
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.NO'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.NO'),
        lockPosition: true,
        suppressMovable: true,
        field: 'id',
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          textAlign: 'center',
        },
        valueGetter: (param) => {
          return (
            param.node.rowIndex + ((this.page - 1) * this.pageSize + 1)
          );
        },
      },
      {
        headerName:  this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.CODE'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.CODE'),
        field: 'code',
        suppressMovable: true,
        minWidth: 142,
        width: 142,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'code',
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.DOCUMENT_TYPE'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.DOCUMENT_TYPE'),
        field: 'documentTypeName',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'documentTypeName',
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.DATE_RELEASE'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.DATE_RELEASE'),
        field: 'releaseDate',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        valueFormatter: this.dateFormatter,
        cellClass: "grid-cell-centered",
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'margin-left':'5px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipValueGetter: params => {
          return this.dateFormatter(params);
        },
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.EFFECTIVE_DATE'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.EFFECTIVE_DATE'),
        field: 'effectiveDate',
        suppressMovable: true,
        valueFormatter: this.dateFormatter,
        minWidth: 128,
        width: 128,
        cellClass: "grid-cell-centered",
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'margin-left':'5px',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipValueGetter: params => {
          return this.dateFormatter(params);
        },
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.SIGNER'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.SIGNER'),
        field: 'signerName',
        // filter: 'Bắt buộc',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'signerName',
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.COMPENDIA'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.COMPENDIA'),
        field: 'compendia',
        suppressMovable: true,
        minWidth: 256,
        width: 256,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'compendia',
      },
      {
        headerName: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.FILE'),
        headerTooltip: this.trans('OFFICAL_LETTER_DOCUMENT.LABEL.FILE'),
        field: '',
        minWidth: 146,
        width: 146,
        cellRenderer : 'downloadButtonRender',
        cellRendererParams: {
          onClick: this.downloadFile.bind(this),
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
      },
      {
        headerName: '',
        field: 'undefined',
        suppressMovable: true,
        //displayce: 'nowrap',
        cellRendererFramework: ActionOfficalLetterDocumentComponent,
        minWidth: 48,
        maxWidth: 48,
      },
    ];
    this.gridOptions = {
      suppressCellSelection: true
    };
    this.frameworkComponents = {
      downloadButtonRender: DownloadButtonRenderComponent,
    };
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    };
    this.isCreateNew = true;
  }

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.changeDetectorRef.detectChanges();
    if(this.form && this.valueDefault){
      this.form.patchValue(this.valueDefault);
      this.search(1);
    }
    setTimeout(this.removeStyle,1000);
  }

  ngAfterViewInit(){
    // console.log(this.templateModal.elementRef);
    this.focus.nativeElement.focus();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    //this.resizeWidthScroll();
    this.removeStyle();
  }

  removeStyle() {
     var removeStyle = document.querySelector('.ag-center-cols-container') as HTMLElement;
     var currentValue =  removeStyle.style.getPropertyValue('width');
     var newCurrentValueFloat = currentValue.slice(0,-2);
     var newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
     var newValue = newCurrentValueInt + 16;
     removeStyle.style.width=`${newValue}px`;

  }

  resizeWidthScroll(): void {
    const scroll = (document.querySelector('.ag-body-horizontal-scroll-container') as HTMLElement)
    const allSemesterColumns = (document.querySelector('.ag-header-container') as HTMLElement)
    scroll.style.width = `${allSemesterColumns.offsetWidth}px`
  }

  dateFormatter(params) {
    return new Date(Date.parse(params.value)).toLocaleDateString();
  }

  downloadFile(path) {
    // alert(path.data.file);
    let filename = path.data.file.split("|");
    console.log(filename);
    filename.forEach(element => {
      if(element != ""){
        const downloadData = Object.assign({},path.data);
        downloadData.file = element;
        this.documentaryService.download(downloadData);
      }
    });
    // this.documentaryService.download(path.data);
  }

  getData(){
    forkJoin(
      this.documentaryService.dataDocumentType('DOCUMENT_TYPE'),
      this.documentaryService.dataDocumentType('DOCUMENT_TYPE'),
      this.documentaryService.dataDocumentType('SIGNER')
    ).subscribe(([resDefault,resAdd, resSigner])=> {
      this.listDocumentType = resDefault.map(obj => {
        let resObj = {};
        resObj['code'] = obj.code
        resObj['name'] = this.la === 'la' ? obj.nameLA : (this.la === 'en' ? obj.nameEN : obj.name)
        return resObj
      });;
      this.listDocumentType.unshift(this.dropDownDefault);
      this.listDocumentAdd = resAdd.map(obj => {
        let resObj = {};
        resObj['code'] = obj.code
        resObj['name'] = this.la === 'la' ? obj.nameLA : (this.la === 'en' ? obj.nameEN : obj.name)
        return resObj
      });;
      this.listDocumentAdd.unshift(this.dropDownAdd);
      this.listSigner = resSigner.map(obj => {
        let resObj = {};
        resObj['code'] = obj.code
        resObj['name'] = this.la === 'la' ? obj.nameLA : (this.la === 'en' ? obj.nameEN : obj.name)
        return resObj
      });
      this.form.get('documentType').setValue(this.listDocumentType[0].code);
    })
    console.log(this.listDocumentType);
    this.valueDefault = this.form.value;
    this.search(1);
  }

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 10;
  page;
  rangeWithDots: any[];
  searchDataExport: any;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  search(page : number){
    // try{
    //   this.gridApi.showLoadingOverlay();
    // }catch(e){}
    this.page = page;
    const data = Object.assign(this.form.value);
    console.log(data.releaseDate);
    if(data.releaseDate != null && data.releaseDate != ""){
      data.releaseDate = new Date(data.releaseDate);
    }
    if(data.compendia != null){
      data.compendia = data.compendia.trim();
    }
    if(data.compendia.length > 250){
      this.toastr.error("Từ khóa không được quá 250 ký tự !");
      return;
    }
    this.hide = false;
    this.searchDataExport = data;
    this.documentaryService.onSearch(page,this.pageSize,data).subscribe(res =>{
      console.log(res);
      this.rowData = res.documentaryDTOList.map(obj => {
        let objRes = {};
        objRes['id']=obj.id
        objRes['code']=obj.code
        objRes['compendia'] = obj.compendia
        objRes['createDate'] = obj.createDate
        objRes['createor'] = obj.creator
        objRes['documentType'] = obj.documentType
        objRes['documentTypeName'] = this.la === 'la' ? obj.documentTypeNameLA : (this.la === 'en' ? obj.documentTypeNameEN : obj.documentTypeName)
        objRes['effectiveDate'] = obj.effectiveDate
        objRes['effectiveDateConverted'] = obj.effectiveDateConverted
        objRes['file'] = obj.file
        objRes['releaseDate']=obj.releaseDate
        objRes['releaseDateConverted']=obj.releaseDateConverted
        objRes['signer']=obj.signer
        objRes['signerName']=this.la === 'la' ? obj.signerNameLA : (this.la === 'en' ? obj.signernameEN : obj.signerName)
        objRes['total']=obj.total
        return objRes
      });
      this.totalRecord = res.total;
      this.first = ((page -1 ) * this.pageSize) + 1;
      this.last = this.first + this.rowData.length - 1;
      if (this.totalRecord % this.pageSize === 0) {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      } else {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      }
      this.hide = true;
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setRowData(this.rowData);
      this.changeDetectorRef.detectChanges();
    },
    err => {
      this.hide = true;
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      documentType: [''],
      releaseDate: [null],
      compendia: ['']
    });
    this.changeDetectorRef.detectChanges();
  }

  export() {

    console.log('searchDataExport', this.searchDataExport);
    this.documentaryService
      .export(this.searchDataExport);
  }

  //===============================Paging=============
  paging(pageSearch: number): void {
    if(this.page == pageSearch){
      return;
    }
    this.page = pageSearch;
    this.search(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.search(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.search(this.page);
  }

  //======================Open Modal=======================
  openModalDocument() {
    const dataAdd : any = {};
    dataAdd.listDocumentAdd = this.listDocumentAdd;
    dataAdd.listSigner = this.listSigner;
    this.isCreateNew = true;
    dataAdd.isCreateNew = this.isCreateNew;
    this.matDialog.open(
      CreateOfficalLetterComponent,{
        data: dataAdd,
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
        autoFocus: false,
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      if(res.event != 'cancel'){
        this.search(1);
      }
    });
  }

  trans(key): string{
    return this.translate.instant(key);
  }
}
