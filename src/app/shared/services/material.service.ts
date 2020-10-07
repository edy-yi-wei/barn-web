import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectMaterial(searchValue, page): any {
    return this.http.get<any>(Constant.appUrl+"/v1/materials?search="+searchValue.search+"&page="+page, this.httpOptions);
  }
  
  getMaterial(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/materials/"+id, this.httpOptions);
  }

  saveMaterial(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/materials", data, this.httpOptions);
  }

  deleteMaterial(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/materials/"+id, null, this.httpOptions);
  }
}
