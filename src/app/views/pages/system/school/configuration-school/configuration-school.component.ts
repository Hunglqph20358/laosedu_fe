import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActionShoolComponent } from '../action-shool/action-shool.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'kt-configuration-school',
  templateUrl: './configuration-school.component.html',
  styleUrls: ['./configuration-school.component.scss']
})
export class ConfigurationSchoolComponent implements OnInit {
  @ViewChild('newUnit') public newUnit: ModalDirective;
  @ViewChild('importUnit') public importUnit: ModalDirective;
  modalRef: BsModalRef;

  columnDefs;
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight=50;
  defaultColDef;
  selectDemo;
  listDemo =[
    {
      id:1,
      name:'Demo'
    }
  ];
  afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.pdf,.docx, .txt,.gif,.jpeg',
    maxSize: "5",
    uploadAPI:  {
      url:"https://example-file-upload-api",
      method:"POST",
      params: {
        'page': '1'
      },
      responseType: 'blob',
    },
    theme: "dragNDrop",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Tải file',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'File có định dạng xlsx, xls, có dung lượng nhỏ hơn 5Mb',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
};

  constructor(private modalService: BsModalService) {
    this.columnDefs = [
    {   headerName: 'STT',
          field:"make",
          valueGetter:'node.rowIndex + 1',
          minWidth:60,
          maxWidth:60,
           cellStyle:{
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'color': '#101840',
             'display': 'flex'
          }
     },
      {   headerName: 'Mã đơn vị',
          field:"make",
          cellStyle:{
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'color': '#3366FF',
             'display': 'flex'
          }
     },
      { headerName: 'Tên đơn vị',field:"make",
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'color': '#101840',
        'display': 'flex'
      }
      },
      { headerName: 'Người phụ trách',field:"make",
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'color': '#101840',
        'display': 'flex'
      }
      },
      { headerName: 'Chức vụ',field:"make",
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'color': '#101840',
          'display': 'flex'
        }
      },
      { headerName: 'Mô tả nhiệm vụ',field:"make",
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'color': '#696F8C',
          'display': 'flex'
        }
      },
      { headerName: '',
      field:'',
      cellRendererFramework: ActionShoolComponent,
      minWidth:50,
      maxWidth:50,

    }
   ];


  this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      { make: 'Toyota', model: 'Celica', price: 35000 },

  ];

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  ngOnInit(): void {
  }
  openModalNewUnit(){
    this.newUnit.show();
  }
  openModalImportUnit(){
    this.importUnit.show();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }





}
