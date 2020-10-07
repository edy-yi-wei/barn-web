import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectPurchaseRequest(page, search): Observable<any> {    
    return this.http.get(Constant.spkUrl + '/v1/purchaseRequests?search='+search+'&page=' + page, this.httpOptions);
  }

  getPurchaseRequest(id): Observable<any> {
    return this.http.get<any>(Constant.spkUrl + '/v1/purchaseRequests/' + id, this.httpOptions);
  }  
  
}
