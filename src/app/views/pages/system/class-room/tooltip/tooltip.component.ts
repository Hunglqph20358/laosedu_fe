import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

interface ToolTipParams extends ICellRendererParams {
  lineBreak?: boolean;
  toolTipArray?: string[];
  toolTip?: string;
}

@Component({
  selector: 'kt-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements ICellRendererAngularComp {

  public params: ToolTipParams;
  public data: any;
  public toolTip: string;

  constructor() { }

  agInit(params: ToolTipParams): void {
    this.params = params;
    if (params.lineBreak === true) {
      this.toolTip = params.toolTipArray.join('\n');
    } else if (params.lineBreak === false) {
      this.toolTip = params.toolTip;
    } else {
      this.toolTip = params.value;
    }
  }

  refresh(params: ToolTipParams): boolean {
    this.params = params;
    return true;
  }
}
