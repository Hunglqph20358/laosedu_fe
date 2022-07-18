import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TeachingTimetableRoutingModule} from './teaching-timetable-routing.module';
import {TeachingTimetableComponent} from './container/teaching-timetable.component';
import {TranslateModule} from '@ngx-translate/core';
import {StatusPipe} from './shared/pipes/status.pipe';
import {ContactPipe} from './shared/pipes/contact.pipe';
import {TeachingTimetableCardComponent} from './components/teaching-timetable-card/teaching-timetable-card.component';
import {LoggedInTeacherComponent} from './components/logged-in-teacher/logged-in-teacher.component';
import {TeachingScheduleComponent} from './components/teaching-schedule/teaching-schedule.component';
import {LocalDatePipe} from './shared/pipes/local-date.pipe';
import {TruncatePipe} from './shared/pipes/truncate.pipe';
import {StatusColorPipe} from './shared/pipes/status-color.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TeachingTimetableFilterComponent} from './components/teaching-timetable-filter/teaching-timetable-filter.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    TeachingTimetableCardComponent,
    LoggedInTeacherComponent,
    TeachingScheduleComponent,
    StatusPipe,
    ContactPipe,
    LocalDatePipe,
    TruncatePipe,
    StatusColorPipe,
    TeachingTimetableFilterComponent,
  ],
  imports: [
    CommonModule,
    TeachingTimetableRoutingModule,
    TranslateModule.forChild(),
    MatTooltipModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [
    LoggedInTeacherComponent,
    TeachingTimetableFilterComponent,
    TeachingScheduleComponent
  ],
  providers: [
    StatusPipe,
    ContactPipe,
    LocalDatePipe,
    TruncatePipe,
    StatusColorPipe,
  ]
})
export class TeachingTimetableModule {
}
