import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectRole(searchValue, page): any {
    return this.http.get<any>(Constant.appUrl+"/v1/roles?search="+searchValue.search+"&page="+page, this.httpOptions);
  }
  
  selectAllRole(): any {
    return this.http.get<any>(Constant.appUrl+"/v1/roles/all", this.httpOptions);
  }

  getRole(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/roles/"+id, this.httpOptions);
  }

  saveRole(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/roles", data, this.httpOptions);
  }

  deleteRole(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/roles/"+id, null, this.httpOptions);
  }

  selectAllModule(): any {
    return this.http.get<any>(Constant.appUrl+"/v1/roles/modules", this.httpOptions);
  }
}
