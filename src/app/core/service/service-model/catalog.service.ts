import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CatalogModel} from "../model/catalog.model";

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;

  constructor(private http: HttpClient) { }

  getCatalog(categoryCode: string){
    return this.http.get<CatalogModel[]>(`${this.API}danh-muc/loai-danh-muc/${categoryCode}`)
  }
}
