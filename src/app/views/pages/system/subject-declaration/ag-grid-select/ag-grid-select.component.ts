import {Component, OnInit} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

// import {IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'app-ag-grid-select',
  templateUrl: './ag-grid-select.component.html',
  styleUrls: ['./ag-grid-select.component.css']
})
export class AgGridSelectComponent implements AgRendererComponent {

  params: any;

  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
  }

  // afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  // }

  refresh(params: any): boolean {
    const x = params.value;
    let y : number = +x;
    params.data.coefficient = y;
    params.api.refreshCells(params);
    return false;
  }
}
