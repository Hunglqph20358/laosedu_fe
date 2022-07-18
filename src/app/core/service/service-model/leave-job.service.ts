import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProvinceData} from './province.service';
import {LeaveJobModel} from '../model/leave-job.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveJobService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  private isReload = new BehaviorSubject<boolean>(false);
  isReload$ = this.isReload.asObservable();

  constructor(private httpClient: HttpClient) { }

  addLeaveJob(leaveJob: LeaveJobModel){
    return this.httpClient.post(`${this.API}leave-jobs`, leaveJob);
  }

  changeIsReload(value: boolean) {
    this.isReload.next(value);
    console.log('changeIsReload ', value);
  }

  getByTeacherId(teacherId: any, isLeave: any): Observable<any>{
    return this.httpClient.get<any>(`${this.API}leave-jobs/teacher?teacherId=${teacherId}&isLeave=${isLeave}`);
  }
}
