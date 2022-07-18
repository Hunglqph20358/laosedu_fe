import { Injectable } from '@angular/core';
import { BasicService } from '../../../../core/service/utils/basic.service';
import { SchoolYearModel } from './school-year.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SchoolYearService extends BasicService {

    url = `${environment.API_GATEWAY_ENDPOINT}school-years`

    findByYear(year: any): Observable<any> {
        return this.postRequest(this.url+'?findYear', year);
    }

    extends(year: any): Observable<any> {
        return this.postRequest(this.url+'?extends', year);
    }

    getAll(obj?: any): Observable<any> {
        return this.postRequest(this.url+'?group', obj)
    }

    createSchoolYear(data: SchoolYearModel[]): Observable<any> {
        return this.postRequest(this.url+'?list', data)
    }

    getListSchoolYearHeader() {
        return this.getRequest(this.url + '/list-year-header');
    }

    getSemesterByYear(year): Observable<any> {
        return this.getRequest(this.url+`?year=${year}`);
    }
    getInfoYear(year): Observable<any> {
        return this.getRequest(this.url+`/find-by-year?year=${year}`);
    }

    getYear(): Observable<any> {
        return this.getRequest(`${this.url}/getYear`)
    }
}
