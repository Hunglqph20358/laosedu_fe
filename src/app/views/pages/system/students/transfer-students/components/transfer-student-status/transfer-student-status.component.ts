import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {BehaviorSubject} from 'rxjs';

const transferIdMapping = {
  0: {
    color: '#474D66',
    code: 'TRANSFER_STUDENTS.REPEAT_A_CLASS'
  },
  1: {
    color: '#52BD94',
    code: 'TRANSFER_STUDENTS.BE_PROMOTED'
  },
  null: {
    color: '#D14343',
    code: 'TRANSFER_STUDENTS.NOT_YET_TRANSFER'
  },
}

@Component({
  selector: 'kt-transfer-student-status',
  templateUrl: './transfer-student-status.component.html',
  styleUrls: ['./transfer-student-status.component.scss']
})
export class TransferStudentStatusComponent implements ICellRendererAngularComp {

  private readonly subject = new BehaviorSubject<{ color: string, code: string }>(transferIdMapping[2]);
  status$ = this.subject.asObservable();

  agInit(params: ICellRendererParams): void {
    const status = transferIdMapping[params.value];
    this.subject.next(status);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
