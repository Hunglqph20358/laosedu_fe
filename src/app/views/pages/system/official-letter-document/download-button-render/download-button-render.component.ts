import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-download-button-render',
  templateUrl: './download-button-render.component.html',
  styleUrls: ['./download-button-render.component.scss']
})
export class DownloadButtonRenderComponent implements ICellRendererAngularComp{

  params;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    this.params.onClick(this.params);
  }

}
