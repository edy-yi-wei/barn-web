import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectContractors(searchValue): any {
    return this.http.get<any>(Constant.spkUrl+"/v1/contractors?search="+searchValue.search+"&contractorType="+searchValue.contractorType+
    "&classification="+searchValue.classification+"&page=1", this.httpOptions);    
    // return this.http.get<any>("http://10.191.20.126:8080/Main/api/coba", {});
  }
  
  getContractor(id): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/contractors/"+id, this.httpOptions);
  }

  saveContractor(data): any {
    return this.http.post<any>(Constant.spkUrl+"/v1/contractors", data, this.httpOptions);
  }

  deleteContractor(id): any {
    return this.http.put<any>(Constant.spkUrl+"/v1/contractors/"+id, null, this.httpOptions);
  }
}
