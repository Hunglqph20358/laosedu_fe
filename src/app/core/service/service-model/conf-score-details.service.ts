import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SubjectModel} from '../model/subjects.model';
import {ConfScoreDetailsModel} from '../model/conf-score-details.model';
import {ConfScoreSubjectModel} from '../model/conf-score-subject.model';
@Injectable({
  providedIn: 'root',
})
export class ConfScoreDetailsService {
  // private API = `${environment.API_GATEWAY_ENDPOINT_TEST}`;
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    })
  }
  constructor(private httpClient: HttpClient) {
  }

  autoSearchSubject(gradeLevel: any):Observable<any>{
    const url = this.API + `subject/grade-level?grade_level=${gradeLevel}`
    return this.httpClient.get<any>(url, this.httpOptions);
  }

getAllGradingByParentCode(parentCode: string): Observable<any> {
    return this.httpClient.get<SubjectModel[]>(
      `${this.API}conf-grading-details/parent-code/${parentCode}`
    );
  }

  getAllScoreByParentCode(parentCode: string): Observable<any> {
    return this.httpClient.get<SubjectModel[]>(
      `${this.API}conf-score-details/parent-code/${parentCode}`
    );
  }
  addScoreSubject(scoreSubject: any): Observable<any> {
    return this.httpClient.post(`${this.API}conf-score-subjects`, scoreSubject);
  }

  addScoreBoard(scoreBoard: any): Observable<any> {
    return this.httpClient.post(`${this.API}scoreboard-confs`, scoreBoard);
  }

  addDataConfScoreDetail(confScoreDetail: any): Observable<any> {
    return this.httpClient.post(`${this.API}conf-score-details`, confScoreDetail)
  }

  addDataConfGradingDetails(confGradingDetails: any): Observable<any> {
    return this.httpClient.post(`${this.API}conf-grading-details`, confGradingDetails);

  }

  addDataConfScore(
    confScoreSubject: ConfScoreSubjectModel
  ): Observable<ConfScoreSubjectModel> {
    return this.httpClient.post(
      `${this.API}conf-score-subjects`,
      confScoreSubject
    );
  }

  updateConfScoreDetail(id: any, confScoreDetail: any): Observable<any> {
    return this.httpClient.post(
      `${this.API}conf-score-details/${id}`,
      confScoreDetail
    );
  }

  updateConfGradeLevelDetail(id: any, confGradeDetail: any): Observable<any> {
    return this.httpClient.put(
      `${this.API}conf-grading-details/${id}`,
      confGradeDetail
    );
  }

  updateScoreSuject(id:any, scoreSubject: any): Observable<any> {
    return this.httpClient.put(`${this.API}conf-score-subjects/${id}`, scoreSubject)
  }

  getAllConfGraDeDetail(search: any): Observable<any> {
    return this.httpClient.get<any[]>(
      `${this.API}conf-grading-details/grade-level`,
      search
    );
  }

  getAllConfScoreDeDetail(search: any): Observable<any> {
    return this.httpClient.get<any[]>(
      `${this.API}conf-score-details/score-details`,
      search
    );
  }

  removeDataConfScore(id: number): Observable<any> {
    return this.httpClient.delete(`${this.API}conf-score-details/${id}`);
  }

  removeDataConfGrade(id: number): Observable<any> {    return this.httpClient.delete(`${this.API}conf-grading-details/${id}`);
  }

  loadGridViewLeft(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API}conf-score-details/score-details`, data);
  }
  findConfScoreSubject(code: any, subjectCode): Observable<any>{
    return this.httpClient.get<any>(`${this.API}conf-score-subjects/parentCode?code=${code}&subject_code=${subjectCode}`);
  }

  addScoreBoardAllGradeLevel():Observable<any>{
    return this.httpClient.post(`${this.API}scoreboard-confs/add-all-gradelevel`, null);
  }

  saveAllSujectSubType(confScoreSubjectType: any): Observable<any>{
    return this.httpClient.post(`${this.API}conf-score-subjects/add-subject-subtype`, confScoreSubjectType);
  }

  addListConfScoreDetails(addListConfScoreDetailsDTO: any): Observable<any>{
    return this.httpClient.post(`${this.API}conf-score-details/addList`, addListConfScoreDetailsDTO);
  }

  findConfScoreSubjectBySubjectId(id: any): Observable<any>{
    return this.httpClient.get<any>(`${this.API}conf-score-subjects/subject-id/${id}`);
  }

  addAllScoreDetails(addConfScoreDetailAllGradeDTO: any): Observable<any>{
    return this.httpClient.post(`${this.API}scoreboard-confs/add-all-score-details`, addConfScoreDetailAllGradeDTO);
  }

  addAllGradingDetails(addConfGradingDetailsDTO: any): Observable<any>{
    return this.httpClient.post(`${this.API}scoreboard-confs/add-all-grading-details`,addConfGradingDetailsDTO);
  }

  getYear(year: any): Observable<any> {
    return this.httpClient.get<any>(`${this.API}school-years/year?year=${year}`);
  }
  getConfScoreSubjectByIdAndYear(id: any, year: any): Observable<any>{
    return this.httpClient.get<any>(`${this.API}conf-score-subjects/search-subject?subject-id=${id}&year=${year}`);
  }

  getEntryLockDate(year: any, gradeCode: any, semester: any, confScoreSubject: any){
    return this.httpClient.get<any>(`${this.API}conf-entry-key-details/lock-date?school_year=${year}&grade_id=${gradeCode}&semester=${semester}&conf-score-subject=${confScoreSubject}`);
  }
  getEntryLockDateGrading(year: any, gradeCode: any, semester: any, confScoreSubject: any){
    return this.httpClient.get<any>(`${this.API}conf-entry-key-details/lock-date/grading-details?school_year=${year}&grade_id=${gradeCode}&semester=${semester}&conf-score-subject=${confScoreSubject}`);
  }

  // Add confsoredetail
  addConfScoreDetails(addConfScoreDetails: any): Observable<any>{
    return this.httpClient.post(`${this.API}conf-score-details/add`, addConfScoreDetails);
  }

  // Add confsoredetail
  addConfGradingDetails(addConfGradingDetails: any): Observable<any>{
    return this.httpClient.post(`${this.API}conf-grading-details/add`, addConfGradingDetails);
  }

  getConfScoreByGradeBook(schoolYear: any, subjectCode: any): Observable<any>{
    return this.httpClient.get<any>(`${this.API}conf-score-details/gradebook?school-year=${schoolYear}&subject-code=${subjectCode}`);
  }
  getConfGradingByGradeBook(schoolYear: any, subjectCode: any): Observable<any>{
    return this.httpClient.get<any>(`${this.API}conf-grading-details/gradebook?school-year=${schoolYear}&subject-code=${subjectCode}`);
  }

  getSemesterConf(year: any){
    return this.httpClient.get<any>(`${this.API}scoreboard-confs/semester?year=${year}`);
  }
}
