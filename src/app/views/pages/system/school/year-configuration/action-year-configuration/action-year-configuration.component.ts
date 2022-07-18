import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'


@Component({
  selector: 'kt-action-year-configuration',
  templateUrl: './action-year-configuration.component.html',
  styleUrls: ['./action-year-configuration.component.scss']
})
export class ActionYearConfigurationComponent implements OnInit {
  selectDemo;
  listDemo =[
    {
      id:1,
      name:'Demo'
    }
  ];

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit() {
  }


  cellValue: string;

  // gets called once before the renderer is used
  agInit(params ): void {
      this.cellValue = params
  }

  // gets called whenever the cell refreshes
  refresh(params) {
      // set value into cell again
      return true
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md' })
    );
  }

}
