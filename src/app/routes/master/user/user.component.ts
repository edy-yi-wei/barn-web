import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';
import { UserService } from '@shared/services/user.service';
import { RoleService } from '@shared/services/role.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class UserComponent implements OnInit {
  formUser: FormGroup;
  retypePassword = new FormControl('');
  isLoading = true;  
  userId = null;  
  roles = [];  
  statusEdit = new FormControl(false);
  parentUrl: any[] = ['/master/user-list'];

  constructor(
    private userService: UserService,   
    private roleService: RoleService, 
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formUser = this.fb.group({
      userId: null,
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required]],
      role: this.fb.group({
        roleId: ['', [Validators.required]],
        roleName: ''        
      })
    });    
  }

  ngOnInit() {
    this.userId = this.router.snapshot.paramMap.get('id');
    if(this.userId!=null){
      this.getData();
      this.statusEdit.setValue(true);
      // this.formUser.get('userPassword').setValue('1');
      this.formUser.get('userPassword').disable();      
      this.retypePassword.disable();
      this.retypePassword.setValue('1');
    } else {
      this.selectRole();
    }
  }

  selectRole() {
    console.log('select role');
    this.isLoading=true;
    for(var i=0; i<this.roles.length;){
      this.roles.pop();
    }    
    this.roleService.selectAllRole().subscribe(
      data => {
        console.log(data);        
        data.forEach(element => {
          this.roles.push(element);
        });        
      },
      error => {
        console.log(error)
      },
      () => {
        this.isLoading=false
      }
    );
  }  

  getData() {
    this.isLoading=true;
    this.userService.getUser(this.userId).subscribe(
      data => {
        console.log(data);
        if(data!=null){
          this.formUser.patchValue(data);
          this.formUser.get('userPassword').setValue('1');
          this.selectRole();          
        } else {
          alert('Data dengan ID '+this.userId+' tidak ditemukan!');
        }
      },
      error => {
        console.log(error)
      },
      () => {
        this.isLoading=false
      }
    );
  }

  save() {    
    if(this.formUser.valid){
      if(this.formUser.get('userPassword').value!=this.retypePassword.value){
        alert('Password yang Anda masukkan tidak cocok!');
        return;
      }
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;        
        this.userService.saveUser(this.formUser.value).subscribe(
          data => {
            console.log(data);
            alert(data[0]);
            this.reset();
            this.routing.navigate(this.parentUrl);
          },
          error => {
            console.log(error);
          },
          () => {
            this.isLoading = false;
          }
        )
      }
    } else {
      Object.keys(this.formUser.controls).forEach(field => {
        const control = this.formUser.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });      
      alert('Field dengan tanda bintang wajib diisi!\nSilahkan diperiksa kembali');
    }
  }

  back() {
    this.routing.navigate(this.parentUrl);
  }

  reset() {
    this.formUser.reset();    
  }
}
