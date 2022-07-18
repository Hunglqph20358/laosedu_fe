import {NotificationService} from '@progress/kendo-angular-notification';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotiService{
  constructor(
    private notificationService: NotificationService,
  ) {  }

  showNoti(content: string, type: 'none' | 'success' | 'warning' | 'error' | 'info') {
    this.notificationService.show({
      content: content,
      type: { style: type, icon: false },
      hideAfter: 2000,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      cssClass: 'p-5 mb-5 mr-5 border-radius'
    });
  }
}
