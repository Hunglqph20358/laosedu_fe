import {Component, Input} from '@angular/core';
import {TeachingSchedule} from '../../shared/models/teaching-schedule';
import {Period} from '../../shared/models/period';
import {TranslateService} from "@ngx-translate/core";
import {Day} from "../../shared/models/day";
import {environment} from '../../../../../../../../environments/environment';

@Component({
  selector: 'kt-teaching-schedule',
  templateUrl: './teaching-schedule.component.html',
  styleUrls: ['./teaching-schedule.component.scss']
})
export class TeachingScheduleComponent {
  MORNING = Period.MORNING;
  AFTERNOON = Period.AFTERNOON;
  teachingSchedule: TeachingSchedule

  @Input() set ts(ts: TeachingSchedule) {
    this.teachingSchedule = ts;
    if (this.teachingSchedule) {
      this.teachingSchedule.days.forEach(e => {
        const lg = localStorage.getItem('language')
        if (lg === 'la') {
          e.name = e.nameLA;
        } else if (lg === 'en') {
          e.name = e.nameEN;
        }
      });
    }
  }

  constructor(private translate: TranslateService) {
  }
}
