import {Component, Input} from '@angular/core';
import {Teacher} from '../../../../../../../core/service/model/teacher.model';

@Component({
  selector: 'kt-logged-in-teacher',
  templateUrl: './logged-in-teacher.component.html',
  styleUrls: ['./logged-in-teacher.component.scss']
})
export class LoggedInTeacherComponent {
  @Input() teacher: Teacher;
}
