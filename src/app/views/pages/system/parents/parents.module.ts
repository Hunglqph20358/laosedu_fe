import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentsRoutingModule } from './parents-routing.module';
import { ParentsComponent } from './parents.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {CoreModule} from "../../../../core/core.module";
import { ParentsStudentProfileComponent } from './student-profile/parents-student-profile.component';
import {NotificationDetailComponent} from "./notification-detail/notification-detail.component";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [ParentsComponent, ParentsStudentProfileComponent, NotificationDetailComponent],
    imports: [
        CommonModule,
        ParentsRoutingModule,
        MatTooltipModule,
        CoreModule,
        MatDialogModule,
        TranslateModule,
    ],
  entryComponents: [NotificationDetailComponent],
  exports: [NotificationDetailComponent]
})
export class ParentsModule { }
