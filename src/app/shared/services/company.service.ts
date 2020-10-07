import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectCompanies(searchValue): any {
    return this.http.get<any>(Constant.spkUrl+"/v1/companies/all?search="+searchValue, this.httpOptions);
  }
  
  getCompany(id): Observable<any> {    
    return this.http.get<any>(Constant.spkUrl + '/v1/companies/' + id, this.httpOptions);
  }  

}
