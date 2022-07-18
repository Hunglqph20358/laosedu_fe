import {Component, Input} from '@angular/core';
import {Schedule} from '../../shared/models/schedule';

@Component({
  selector: 'kt-teaching-timetable-card',
  templateUrl: './teaching-timetable-card.component.html',
  styleUrls: ['./teaching-timetable-card.component.scss'],
})
export class TeachingTimetableCardComponent {
  @Input() schedule: Schedule;
  @Input() index: number;
}
