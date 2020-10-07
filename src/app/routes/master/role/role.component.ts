import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';
import { RoleService } from '@shared/services/role.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class RoleComponent implements OnInit {
  formRole: FormGroup;
  isLoading = true;  
  roleId = null;  
  modules = new FormArray([]);
  dataSource: MatTableDataSource<any>;
  parentUrl: any[] = ['/master/role-list'];
  columns: string[] = ['parent', 'module', 'aktif'];

  constructor(
    private roleService: RoleService,    
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formRole = this.fb.group({
      roleId: null,
      roleName: ['', [Validators.required]],
      notes: '',
      moduleList: this.fb.array([])
    });    
  }

  ngOnInit() {
    this.roleId = this.router.snapshot.paramMap.get('id');
    if(this.roleId!=null){
      this.getData();      
    } else {
      this.selectModule();
    }
    this.dataSource= new MatTableDataSource((this.modules).controls);
    this.modules.valueChanges.subscribe(
      newValue => {
        this.dataSource._updateChangeSubscription();
      }
    );
  }

  selectModule() {
    this.isLoading=true;
    this.roleService.selectAllModule().subscribe(
      data => {
        // console.log(data);        
        data.forEach(element => {
          this.modules.push(this.createModule(element));
        });
        var activeModule = this.formRole.get('moduleList') as FormArray;        
        if(activeModule.length>0){
          activeModule.value.forEach(element => {
            for(var i=0; i<this.modules.length; i++){
              // console.log(this.modules.value[i].moduleId);
              // console.log(element);
              if(this.modules.value[i].moduleId==element.module.moduleId){
                this.modules.controls[i].get('aktif').setValue(true);
                // console.log(element.module.moduleId);
              }
            }
          });
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

  createModule(data){
    return this.fb.group({
      moduleId: data.moduleId,
      moduleName: data.moduleName,
      parentName: data.parentName,
      aktif: data.aktif
    });
  }

  createRoleModule(data){
    return this.fb.group({
      module: this.fb.group({
        moduleId: data.moduleId
      }),
      readOnly: false,      
      active: true
    });
  }

  getData() {
    this.isLoading=true;
    this.roleService.getRole(this.roleId).subscribe(
      data => {
        // console.log(data);
        if(data!=null){
          this.formRole.patchValue(data);
          var activeModule = this.formRole.get('moduleList') as FormArray;
          data.moduleList.forEach(element => {
            activeModule.push(this.createRoleModule(element.module));
          });
          this.selectModule();
        } else {
          alert('Data dengan ID '+this.roleId+' tidak ditemukan!');
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
    if(this.formRole.valid){      
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;
        var activeModule = this.formRole.get('moduleList') as FormArray;
        while(activeModule.length>0){
          activeModule.removeAt(0);
        }
        this.modules.value.forEach(element => {
          if(element.aktif){
            activeModule.push(this.createRoleModule(element));
          }
        });
        this.roleService.saveRole(this.formRole.value).subscribe(
          data => {
            console.log(data);
            alert(data[0]);
            // this.reset();
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
      Object.keys(this.formRole.controls).forEach(field => {
        const control = this.formRole.get(field);
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
    this.formRole.reset();    
  }
}
