import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService, Constant } from '@shared';

@Component({
  selector: 'app-callback',
  template: `
    
  `,
})
export class CallbackComponent implements OnInit {
  token = null;
  constructor(private router: ActivatedRoute, private sessionStorageService: SessionStorageService) {}

  ngOnInit() {
    // console.log(this.token);
    this.router.queryParams.subscribe(
      data => {
        console.log(data);
        this.token = data.token;
        // console.log('1: '+this.token);
        if(this.token==null){
          this.token = this.sessionStorageService.get('auth-token');
          // console.log('2: '+this.token);
          if(this.token==null){
            /* --redirect to authentication server-- */
            // console.log('token null');
            window.location.href = ''+Constant.loginUrl;
          }
        } else {
          this.sessionStorageService.set('auth-token', this.token);
          this.sessionStorageService.set('user-name', data.userName);
          window.location.href = 'dashboard';
        }
      }
    );   
  }
}
