import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { Observable } from 'rxjs';
import { SessionStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ token
      })      
    } 
  }

  downloadFile(fileId): Observable<HttpResponse<string>> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/octet-stream; charset=utf-8');

    return this.http.get(Constant.spkUrl+'/v1/files/'+fileId, {
      headers: headers,
      observe: 'response',
      responseType: 'text'
    });
  }

  uploadFile(formData): Observable<any> {
    return this.http.post<any>(Constant.spkUrl + '/v1/files', formData, this.httpOptions);
  }
}
