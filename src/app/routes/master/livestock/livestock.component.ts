import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { LivestockService } from '@shared/services/livestock.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';

@Component({
  selector: 'livestock',
  templateUrl: './livestock.component.html',
  styleUrls: ['./livestock.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class LivestockComponent implements OnInit {
  formLivestock: FormGroup;
  isLoading = true;  
  livestockId = null;    
  parentUrl: any[] = ['/master/livestock-list'];

  constructor(
    private livestockService: LivestockService,       
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formLivestock = this.fb.group({
      livestockTypeId: null,
      livestockName: ['', [Validators.required]],      
      notes: ''
    });

  }

  ngOnInit() {
    this.livestockId = this.router.snapshot.paramMap.get('id');
    if(this.livestockId!=null){
      this.getData();    
    }
  }
  
  getData() {
    this.isLoading=true;
    this.livestockService.getLivestock(this.livestockId).subscribe(
      data => {
        console.log(data);
        if(data!=null){
          this.formLivestock.patchValue(data);                    
        } else {
          alert('Data dengan ID '+this.livestockId+' tidak ditemukan!');
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
    if(this.formLivestock.valid){
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;
        this.livestockService.saveLivestock(this.formLivestock.value).subscribe(
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
      Object.keys(this.formLivestock.controls).forEach(field => {
        const control = this.formLivestock.get(field);
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
    this.formLivestock.reset();
  }
}
