import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-student-infomation',
  templateUrl: './student-infomation.component.html',
  styleUrls: ['./student-infomation.component.scss']
})
export class StudentInfomationComponent implements OnInit {

  @Input() infoStudent: any;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

}
