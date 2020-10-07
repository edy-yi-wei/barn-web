import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token
      })      
    } 
  }

  selectInbox(searchValue, page: number): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/workspace/inbox?search="+searchValue.search+"&transaction-code="+searchValue.transactionCode+
    "&page="+(page+1), this.httpOptions);    
  }
  
  fetchNextRow(searchValue, page: number): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/workspace/inbox/next-row?search="+searchValue.search+"&transaction-code="+searchValue.transactionCode+
    "&page="+(page+1), this.httpOptions);    
  }

  selectOutbox(searchValue, page: number): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/workspace/outbox?search="+searchValue.search+"&transaction-code="+searchValue.transactionCode+
    "&page="+(page+1), this.httpOptions);
  }

  approve(transactionType: string, transactionId: number, approvalNotes: string): Observable<any> {
    return this.http.post<any>(Constant.spkUrl+"/v1/workspace/approve?transactionType="+transactionType+"&transactionId="+transactionId+"&approvalNotes="+approvalNotes, {}, this.httpOptions);
  }

  reject(transactionType: string, transactionId: number, approvalNotes: string): Observable<any> {
    return this.http.post<any>(Constant.spkUrl+"/v1/workspace/reject?transactionType="+transactionType+"&transactionId="+transactionId+"&approvalNotes="+approvalNotes, {}, this.httpOptions);
  }

  approveAll(data): Observable<any> {
    return this.http.post<any>(Constant.spkUrl+"/v1/workspace/approveAll", data, this.httpOptions);
  }

  rejectAll(data): Observable<any> {
    return this.http.post<any>(Constant.spkUrl+"/v1/workspace/rejectAll", data, this.httpOptions);
  }
}
