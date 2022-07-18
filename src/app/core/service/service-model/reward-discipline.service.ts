import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProvinceData} from './province.service';
import {RewardDisciplineModel} from '../model/reward-discipline.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RewardDisciplineService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient) { }

  apiGetAllProvince(){
    return this.httpClient.get<ProvinceData>(`${this.API}reward-disciplines`);
  }

  addBouns(rewardDiscipline: RewardDisciplineModel): Observable<any>{
    return this.httpClient.post(`${this.API}reward-disciplines`, rewardDiscipline);
  }
}