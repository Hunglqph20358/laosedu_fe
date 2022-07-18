import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { TeacherProfileComponent } from './teacher-profile.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ViewFileComponent } from './view-file/view-file.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TooltipTeacherComponent } from './tooltip-teacher/tooltip-teacher.component';

const routers = [
  {
      path: '',
      component: TeacherProfileComponent
  }
]

@NgModule({
  declarations: [TooltipTeacherComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routers),
        AgGridModule.withComponents([]),
        MatDialogModule,
        NgSelectModule,
        FormsModule,
        NgbModule,
        MatTooltipModule

    ],
  entryComponents: [TooltipTeacherComponent]
})
export class TeacherProfileModule { }
