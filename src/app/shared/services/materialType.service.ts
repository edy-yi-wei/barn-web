import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectAllMaterialType(): any {
    return this.http.get<any>(Constant.appUrl+"/v1/materialTypes/all", this.httpOptions);
  }
  
  getMaterialType(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/materialTypes/"+id, this.httpOptions);
  }
  
}
