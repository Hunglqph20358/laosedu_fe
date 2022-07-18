import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {ReportsComponent} from './reports.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

const routers = [
  {
    path: '',
    component: ReportsComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    NgSelectModule,
    FormsModule,
    AngularFileUploaderModule,
    AgGridModule.withComponents([]),
    ModalModule.forRoot(),
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    TranslateModule,
  ],
  entryComponents:
    []
})
export class ReportsModule {
}
