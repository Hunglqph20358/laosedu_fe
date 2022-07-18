// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
// Partials
import {PartialsModule} from '../partials/partials.module';
// Pages
import {CoreModule} from '../../core/core.module';
import {ClassRoomComponent} from './system/class-room/class-room.component';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {BodyModule, GridModule, PagerModule, SharedModule} from '@progress/kendo-angular-grid';
import {ButtonModule} from '@progress/kendo-angular-buttons';
import {DialogModule} from '@progress/kendo-angular-dialog';
import {SystemModule} from './system/system.module';
import {ClassRoomModule} from './system/class-room/class-room.module';
import {AgGridModule} from 'ag-grid-angular';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ConfigPointLockModule} from "./system/config-point-lock/config-point-lock.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReportsModule} from './system/reports/reports.module';
import {DiligenceModule} from './system/diligence/diligence.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [ClassRoomComponent],
  exports: [],

    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        CoreModule,
        PartialsModule,
        NgbCollapseModule,
        DropDownsModule,
        GridModule,
        ButtonModule,
        PagerModule,
        ReportsModule,
        DiligenceModule,
        DialogModule,
        SystemModule,
        ClassRoomModule,
        ConfigPointLockModule,
        SharedModule,
        BodyModule,
        AgGridModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        NgSelectModule,
        MatTooltipModule,
        TranslateModule,
    ],
  providers: []
})
export class PagesModule {
}
