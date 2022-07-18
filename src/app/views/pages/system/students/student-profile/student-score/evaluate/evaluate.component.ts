import { Component, OnInit } from '@angular/core';
import {ICellRendererParams} from 'ag-grid-community';
import {ICellRendererAngularComp} from 'ag-grid-angular';

interface ToolTipParams extends ICellRendererParams {
  lineBreak?: boolean;
  toolTipArray?: string[];
  toolTip?: string;
}

@Component({
  selector: 'kt-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements ICellRendererAngularComp {

  public params;
  values
  isValueEmpty

  constructor() { }

  agInit(params): void {
    this.params = params
    this.values = params.data.evaluate?.split('\n') || []
    this.isValueEmpty = this.values.length === 1
    // if (this.values.length == 0) {
    //   this.isValueEmpty = true
    //   this.values.push('-')
    // }
  }

  refresh(params): boolean {
    this.params = params;
    return true;
  }

}
