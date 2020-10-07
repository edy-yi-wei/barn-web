import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpkService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token,
        'Content-Type': 'application/json'
      })      
    } 
    
  }

  selectSpks(searchValue, page): any {
    return this.http.get<any>(Constant.spkUrl+"/v1/spks?search="+searchValue.search+"&type="+searchValue.type+
    "&company="+searchValue.company+"&status="+searchValue.status+"&page="+(page+1), this.httpOptions);    
  }
  
  getSpk(id): any {
    return this.http.get<any>(Constant.spkUrl+"/v1/spks/"+id, this.httpOptions);
  }

  saveSpk(data, action): any {
    return this.http.post<any>(Constant.spkUrl+"/v1/spks?action="+action, data, this.httpOptions);
  }

  deleteSpk(id): any {
    return this.http.put<any>(Constant.spkUrl+"/v1/spks/"+id, null, this.httpOptions);
  }

  selectCategories(): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/attachment-categories", this.httpOptions);    
  }

  readWorkDetail(fileId): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/spks/read-work-detail?fileId="+fileId, this.httpOptions);
  }

  getApprovalFlow(spkTypeId): Observable<any> {
    return this.http.get<any>(Constant.spkUrl+"/v1/spks/approval-flow?spkTypeId="+spkTypeId, this.httpOptions);
  }

  approveSpk(spkId, approvalNotes): Observable<any> {    
    return this.http.post<any>(Constant.spkUrl+"/v1/spks/approve?id="+spkId+"&approvalNotes="+approvalNotes, {}, this.httpOptions);
  }

  rejectSpk(spkId, approvalNotes): Observable<any> {
    return this.http.post<any>(Constant.spkUrl+"/v1/spks/reject?id="+spkId+"&approvalNotes="+approvalNotes, null, this.httpOptions);
  }
 
  downloadSpk(spkId): Observable<HttpResponse<string>> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/octet-stream; charset=utf-8');

    return this.http.get(Constant.spkUrl+'/v1/spks/download-spk/'+spkId, {
      headers: headers,
      observe: 'response',
      responseType: 'text'
    });
  }

  // errHandler(error: HttpErrorResponse) {
  //   console.log('error');
  //   return throwError('gagal');
  // }
}
