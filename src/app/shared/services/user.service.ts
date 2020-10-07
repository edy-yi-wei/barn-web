import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectUser(searchValue, page): any {
    return this.http.get<any>(Constant.appUrl+"/v1/users?search="+searchValue.search+"&page="+page, this.httpOptions);
  }
  
  getUser(id): Observable<any> {    
    return this.http.get<any>(Constant.appUrl+"/v1/users/"+id, this.httpOptions);
  }

  saveUser(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/users", data, this.httpOptions);
  }

  deleteUser(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/users/"+id, null, this.httpOptions);
  }
}
