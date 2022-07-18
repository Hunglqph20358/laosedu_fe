import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { ActionYearConfigurationComponent } from './action-year-configuration/action-year-configuration.component';

@Component({
  selector: 'kt-year-configuration',
  templateUrl: './year-configuration.component.html',
  styleUrls: ['./year-configuration.component.scss']
})
export class YearConfigurationComponent implements OnInit {

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
      {   headerName: 'NĂM HỌC',
          field:"make",
          cellStyle:{
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            'color': '#3366FF',
             'display': 'flex'
          }
     },
      { headerName: 'số học kỳ',field:"make",
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'color': '#101840',
        'display': 'flex'
      }
      },
      { headerName: 'bắt đầu học kỳ I',field:"make",
      cellStyle:{
        'font-weight': '500',
        'font-size': '12px',
        'align-items': 'center',
        'color': '#101840',
        'display': 'flex'
      }
      },
      { headerName: 'kết thúc học kỳ I',field:"make",
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'color': '#101840',
          'display': 'flex'
        }
      },
      { headerName: 'bắt đầu học kỳ II',field:"make",
        cellStyle:{
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          'color': '#696F8C',
          'display': 'flex'
        }
      },
      { headerName: 'Kết thúc học kỳ II',field:"make",
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
      cellRendererFramework: ActionYearConfigurationComponent,
      minWidth:50,
      maxWidth:50,

    }

   ];


  this.rowData = [
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},
      { make: '2021 - 2022'},


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
