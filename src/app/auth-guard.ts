import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SessionStorageService, Constant } from '@shared';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private sessionStorageService: SessionStorageService){}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        var token = this.sessionStorageService.get('auth-token');
        console.log(token);
        if(token==null){
            /* --REDIRECT TO AUTHENTICATION SERVER-- */
            var loginUrl = Constant.loginUrl;
            window.location.href = ''+loginUrl;
        } else {
            return true;
        }
    }
}