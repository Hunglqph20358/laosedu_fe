import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransferStudentsRoutingModule} from './transfer-students-routing.module';
import {TransferStudentsComponent} from './container/transfer-students.component';
import {TransferStudentHeaderComponent} from './components/transfer-student-header/transfer-student-header.component';
import {TranslateModule} from '@ngx-translate/core';
import {TransferStudentSearchComponent} from './components/transfer-student-search/transfer-student-search.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TransferStudentGridComponent} from './components/transfer-student-grid/transfer-student-grid.component';
import {AgGridModule} from 'ag-grid-angular';
import {MatRippleModule} from '@angular/material/core';
import {TransferStudentActionComponent} from './components/transfer-student-action/transfer-student-action.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TransferStudentDialogComponent} from './components/transfer-student-dialog/transfer-student-dialog.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TransferStudentStatusComponent} from './components/transfer-student-status/transfer-student-status.component';
import {TransferStudentUpdateDialogComponent} from './components/transfer-student-update-dialog/transfer-student-update-dialog.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {TransferStudentFooterComponent} from './components/transfer-student-footer/transfer-student-footer.component';
import { TransferStudentNotifyComponent } from './components/transfer-student-notify/transfer-student-notify.component';

@NgModule({
  declarations: [
    TransferStudentsComponent,
    TransferStudentHeaderComponent,
    TransferStudentSearchComponent,
    TransferStudentGridComponent,
    TransferStudentActionComponent,
    TransferStudentStatusComponent,
    TransferStudentDialogComponent,
    TransferStudentUpdateDialogComponent,
    TransferStudentFooterComponent,
    TransferStudentNotifyComponent,
  ],
  imports: [
    CommonModule,
    TransferStudentsRoutingModule,
    TranslateModule.forChild(),
    NgSelectModule,
    NgbModalModule,
    ModalModule.forChild(),
    AgGridModule,
    MatRippleModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    TransferStudentActionComponent,
    TransferStudentStatusComponent,
    TransferStudentDialogComponent,
    TransferStudentUpdateDialogComponent,
    TransferStudentNotifyComponent,
  ]
})
export class TransferStudentsModule {
}
