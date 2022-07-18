import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {NotiService} from './notification.service';
import {environment} from '../../../../environments/environment';
import {ComparisonOperator, FilterItems, GridParam, SortDirection} from '../model/grid-param';
import {catchError, map, tap} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {BasicService} from '../utils/basic.service';
import {HelperService} from '../utils/helper.service';
import { CommonServiceService } from '../utils/common-service.service';
import { Teacher } from '../model/teacher.model';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
  })

  export class DocumentaryService extends BasicService{

    private API = `${environment.API_GATEWAY_ENDPOINT}`;
    private inforFind: GridParam;
    private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      })
    }

    constructor(private http: HttpClient, private notiService: NotiService,private commonService: CommonServiceService,
                private translateSerive: TranslateService,
                public helperService: HelperService) {
      super(http,helperService);
    }

    dataDocumentType(type: string){
        return this.http.get<any>(`${this.API}documentaries/getData?type=${type}`);
    }

    onSearch(page,pageSize,body) {
      return this.http.post<any>(`${this.API}documentaries/search?page=${page}&pageSize=${pageSize}`, body);
    }

    export(data){
      const url = this.API + `documentaries/exportExcel`;
      return this.commonService.downloadFile(url, data, null, this.translateSerive.instant("OFFICAL_LETTER_DOCUMENT.EXCEL_FILE_NAME") + `${moment().format('DDMMYYYY').toString()}.xlsx`);
    }

    download(data) {
      const filename = data.file.substring(data.file.lastIndexOf('/')+1);
      return this.commonService.downloadFile(`${this.API}documentaries/download`, data, null, filename);
    }

    deleteDocument(data){
      return this.httpClient.post<any>(`${this.API}documentaries/delete`, data, this.httpOptions);
    }

    create(formData: FormData, data){
      if(data){
        formData.append('code',data.code.trim());
        formData.append('documentType',data.documentType);
        formData.append('releaseDate',new Date(data.releaseDate).toString());
        formData.append('effectiveDate', new Date(data.effectiveDate).toString());
        formData.append('signer',data.signer);
        formData.append('compendia',data.compendia.trim());
      }
      return this.http.post(`${this.API}documentaries/create`, formData);
    }

    update(formData: FormData, data){
      if(data){
        formData.append('id',data.id);
        formData.append('code',data.code.trim());
        formData.append('documentType',data.documentType);
        formData.append('releaseDate',new Date(data.releaseDate).toString());
        formData.append('effectiveDate', new Date(data.effectiveDate).toString());
        formData.append('signer',data.signer);
        formData.append('compendia',data.compendia.trim());
        formData.append('file',data.file);
      }
      return this.http.post(`${this.API}documentaries/update`, formData);
    }

    getData(data){
      return this.httpClient.get<any>(`${this.API}documentaries/${data.id}`,null);
    }

    downloadData(data:any){
      return this.httpClient.post(`${this.API}documentaries/download`,data,{responseType : 'blob'});
    }

    checkExist(data){
      return this.http.post<any>(`${this.API}documentaries/checkExist`,data,this.httpOptions);
    }
}
