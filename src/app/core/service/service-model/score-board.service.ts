import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotiService} from './notification.service';
import {SubjectModel} from '../model/subjects.model';


@Injectable({
  providedIn: 'root'
})

export class ScoreBoardService {

  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private httpClient: HttpClient,
              private notiService: NotiService) {
  }

  url: string = environment.API_GATEWAY_ENDPOINT + '/scoreboard-confs';

  getAllGradeLevel():Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}grade-levels/khoi`);
  }

  getGridViewLeft(gradeLevel : any, subjectId : any, dateApply : Date, supType: any): Observable<any>{
   return this.httpClient.get<any[]>(`${this.API}conf-score-details/load-grid-left?grade-level=${gradeLevel}&subject-id=${subjectId}&date-apply=${dateApply}&sup-type=${supType}`);
  }
  loadGridViewLeft(gradeLevel : any, subjectId : any, dateApply : Date, year: any): Observable<any>{
   return this.httpClient.get<any[]>(`${this.API}conf-score-details/load-grid-left-2?grade-level=${gradeLevel}&subject-id=${subjectId}&date-apply=${dateApply}&year=${year}`);
  }
  getGridViewRight(gradeLevel : any, subjectId : any, dateApply : Date, supType: any): Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}scoreboard-confs/load-grid-right?grade-level=${gradeLevel}&subject-id=${subjectId}&date-apply=${dateApply}&sup-type=${supType}`);
  }
  loadGridViewRight(gradeLevel : any, subjectId : any, dateApply : Date, year: any): Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}conf-grading-details/load-grid-right?grade-level=${gradeLevel}&subject-id=${subjectId}&date-apply=${dateApply}&year=${year}`);
  }

  searchSubject(gradeLevel : any, supType: any):Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}scoreboard-confs/search-subject?grade-level=${gradeLevel}&sup-type=${supType}`);
  }
  getAllGridScoreCal():Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}/conf-score-details/score-details`);
  }

  getAllGridScoreLevel():Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}/conf-grading-details/level-detail`)
  }

  getAll(obj: any, page?: any):Observable<any>{
    return this.httpClient.get<any[]>(`${this.API}`);
  }

  findById(id: any):Observable<any>{
    return this.httpClient.get<any>(`${this.url}/`+ id);
  }

  updateScoreBoard(obj: any, id: any): Observable<any>{
    return this.httpClient.put(`${this.url}/`+ id, obj);
  }

  saveScoreBoard(obj:any): Observable<any>{
    return this.httpClient.post(`${this.url}`, obj);
  }

  deleteScoreBoard(id: any): Observable<any>{
    return this.httpClient.delete(`${this.url}`+id);
  }

  getSchoolYear(years: any) {
    return this.httpClient.get<any>(`${this.url}/school-years/year?year=${years}`);
  }
}
