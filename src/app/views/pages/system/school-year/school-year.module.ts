import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActionShoolYearComponent } from './action-shool-year/action-shool-year.component';
import { CreateSchoolYearComponent } from './create-school-year/create-school-year.component';
import { SchoolYearComponent } from './school-year.component';

const routers = [
    {
        path: '',
        component: SchoolYearComponent
    }
]
@NgModule({
    declarations: [
        SchoolYearComponent,
        CreateSchoolYearComponent,
        ActionShoolYearComponent,
    ],

    imports: [
        CommonModule,
        RouterModule.forChild(routers),
        AgGridModule.withComponents([]),
        MatDialogModule,
        NgSelectModule,
        FormsModule,
        ToastrModule.forRoot({
            timeOut: 1000,
            positionClass: 'toast-bottom-right'
        }),
        TranslateModule
    ],

    entryComponents: [
        CreateSchoolYearComponent,
        ActionShoolYearComponent
    ],

    providers: [
        ToastrService
    ]

})
export class SchoolYearModule {}
