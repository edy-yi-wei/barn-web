import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivestockService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectLivestock(searchValue, page): any {
    return this.http.get<any>(Constant.appUrl+"/v1/livestockTypes?search="+searchValue.search+"&page="+page, this.httpOptions);
  }
  
  selectAllLivestock(): any {
    return this.http.get<any>(Constant.appUrl+"/v1/livestockTypes/all", this.httpOptions);
  }

  getLivestock(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/livestockTypes/"+id, this.httpOptions);
  }

  saveLivestock(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/livestockTypes", data, this.httpOptions);
  }

  deleteLivestock(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/livestockTypes/"+id, null, this.httpOptions);
  }
}
