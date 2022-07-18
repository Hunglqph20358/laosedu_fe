// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-button-renderer2',
  template: `
    <a (click)="onClick($event)" *ngIf="params.data.isValid; else no">{{'TEACHER_RATING.FILE_MNG_ASSESSMENT' | translate}}</a>
    <ng-template #no>
      <span>-</span>
    </ng-template>
    `,
  styleUrls: ['../button-renderer/button-renderer.component.scss']
})

export class ButtonRendererComponent2 implements ICellRendererAngularComp {

  params;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    this.params.onClick(this.params);
  }
}
