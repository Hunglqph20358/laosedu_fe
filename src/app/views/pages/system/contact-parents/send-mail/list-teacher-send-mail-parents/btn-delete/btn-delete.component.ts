import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ListTeacherSendMailParentsComponent} from "../list-teacher-send-mail-parents.component";

@Component({
  selector: 'kt-btn-delete',
  templateUrl: './btn-delete.component.html',
  styleUrls: ['./btn-delete.component.scss']
})
export class BtnDeleteComponent implements OnDestroy {
  private params: any;

  constructor(private listTeacher: ListTeacherSendMailParentsComponent) {
  }

  agInit(params: any): void {
    this.params = params;
  }
  btnClickedHandler() {
    // const selectedNode = this.params.node;
    // this.params.api.applyTransaction({remove: [selectedNode.data]});
    // this.listTeacher.removeItem(this.params);
  }
  ngOnDestroy() {
    // no need to remove the button click handler as angular does this under the hood
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
