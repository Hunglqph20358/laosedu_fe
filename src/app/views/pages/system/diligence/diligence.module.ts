import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {DiligenceComponent, FlyingHeroesPipe} from './diligence.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

const routers = [
  {
    path: '',
    component: DiligenceComponent
  }
]

@NgModule({
  declarations: [FlyingHeroesPipe],
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
  exports: [
    FlyingHeroesPipe
  ],
  entryComponents:
    []
})
export class DiligenceModule {
}
