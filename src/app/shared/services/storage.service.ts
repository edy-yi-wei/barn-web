import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  get(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  set(key: string, value: any): boolean {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
