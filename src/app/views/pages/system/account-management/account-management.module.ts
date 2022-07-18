import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import 'ag-grid-enterprise';
import {CommonModule} from "@angular/common";
import {NgbButtonsModule, NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [],
  imports: [
    CommonModule,
    NgbModalModule,
    // RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    MatDialogModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    MatTooltipModule,

  ],
  entryComponents:
    [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AccountManagementModule {
}
