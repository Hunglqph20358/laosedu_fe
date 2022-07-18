import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'kt-transfer-student-footer',
  templateUrl: './transfer-student-footer.component.html',
  styleUrls: ['./transfer-student-footer.component.scss']
})
export class TransferStudentFooterComponent {

  @Output() uncheckClicked = new EventEmitter<void>();
  @Output() transferClicked = new EventEmitter<void>();
}
