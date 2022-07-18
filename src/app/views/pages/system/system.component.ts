import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'kt-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
