import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'kt-transfer-student-action',
  templateUrl: './transfer-student-action.component.html',
  styleUrls: ['./transfer-student-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferStudentActionComponent implements ICellRendererAngularComp {

  private readonly subject = new BehaviorSubject<ICellRendererParams>(undefined);
  params$ = this.subject.asObservable();

  agInit(params: ICellRendererParams): void {
    this.subject.next(params);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onClick() {
    const value = this.subject.value;
    const colDef = value.colDef as any;

    if (typeof colDef.onEditClicked === 'function') {
      colDef.onEditClicked(value.data);
    }
  }
}
