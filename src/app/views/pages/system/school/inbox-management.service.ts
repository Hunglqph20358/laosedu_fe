import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NotiService} from '../../../../core/service/service-model/notification.service';
import {CommonServiceService} from '../../../../core/service/utils/common-service.service';
import {HelperService} from '../../../../core/service/utils/helper.service';
import {BasicService} from '../../../../core/service/utils/basic.service';
import {environment} from '../../../../../environments/environment';
import {GradeLevelModel} from '../../../../core/service/model/grade-level.model';

@Injectable({
  providedIn: 'root'
})
export class InboxManagementService {

  private totalReceived = new BehaviorSubject(null);
  totalReceived$ = this.totalReceived.asObservable();

  sendValue(value: number){
    this.totalReceived.next(value);
  }
}
