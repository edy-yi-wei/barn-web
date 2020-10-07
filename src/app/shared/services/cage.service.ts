import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CageService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectCages(searchValue, page): any {
    return this.http.get<any>(Constant.appUrl+"/v1/cages?search="+searchValue.search+"&page="+page, this.httpOptions);
  }
  
  getCage(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/cages/"+id, this.httpOptions);
  }

  saveCage(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/cages", data, this.httpOptions);
  }

  deleteCage(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/cages/"+id, null, this.httpOptions);
  }
}
