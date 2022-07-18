import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgbActiveModal, NgbCollapseModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DropDownListModule} from '@progress/kendo-angular-dropdowns';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {ButtonModule} from '@progress/kendo-angular-buttons';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NgSelectModule} from '@ng-select/ng-select';
import {ConfigPointLockComponent} from './config-point-lock.component';
import {AddConfigComponent} from './add-config/add-config.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AgGridModule} from 'ag-grid-angular';
import { DateLockPointComponent } from './date-lock-point/date-lock-point.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ActionConfLockPointComponent } from './action-conf-lock-point/action-conf-lock-point.component';
import { UpdateConfLockComponent } from './update-conf-lock/update-conf-lock.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfigNotifyComponent } from './config-notify/config-notify.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ConfigPointLockComponent,
  }
]

@NgModule({
    declarations: [
        AddConfigComponent,
        DateLockPointComponent,
        ActionConfLockPointComponent,
        UpdateConfLockComponent,
        ConfirmDialogComponent,
        ConfigNotifyComponent,
    ],
    imports: [
        CommonModule,
        NgbModalModule,
        RouterModule.forChild(routes),
        DropDownListModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        NgbCollapseModule,
        ButtonModule,
        ModalModule,
        NgSelectModule,
        MatCheckboxModule,
        AgGridModule,
        BsDatepickerModule,
        TranslateModule,
    ],

  exports: [
    MatFormFieldModule,
    MatInputModule,
    AddConfigComponent,
    AgGridModule,
    MatCheckboxModule,
  ],
  entryComponents: [
    AddConfigComponent,
    DateLockPointComponent,
    ActionConfLockPointComponent,
    ConfirmDialogComponent,
    UpdateConfLockComponent,
    ConfigNotifyComponent,
  ],
  providers:[NgbActiveModal,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConfigPointLockModule {
}
