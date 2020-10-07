import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '@shared/utils/utils';
import { SessionStorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupCategoryService {
  httpOptions = { };

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // var token = sessionStorageService.get('auth-token');    
    this.httpOptions = {
      headers: new HttpHeaders({
        // Authorization: 'Bearer '+ token
      })      
    } 
    
  }

  selectGroupCategory(parentId): any {
    return this.http.get<any>(Constant.appUrl+"/v1/groupCategories?parentId="+parentId, this.httpOptions);
  }

  selectAllGroupCategory(parentId): any {
    return this.http.get<any>(Constant.appUrl+"/v1/groupCategories/all?parentId="+parentId, this.httpOptions);
  }
    
  getGroupCategory(id): Observable<any> {
    return this.http.get<any>(Constant.appUrl+"/v1/groupCategories/"+id, this.httpOptions);
  }

  saveGroupCategory(data): any {
    return this.http.post<any>(Constant.appUrl+"/v1/groupCategories", data, this.httpOptions);
  }

  deleteGroupCategory(id): any {
    return this.http.put<any>(Constant.appUrl+"/v1/groupCategories/"+id, null, this.httpOptions);
  }

  addGroupCategory(groupId:number, newGroupName: string): any {
    return this.http.post<any>(Constant.appUrl+"/v1/groupCategories/add?groupId="+groupId+"&newGroupName="+newGroupName, null, this.httpOptions);
  }
}
