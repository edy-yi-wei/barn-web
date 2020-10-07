import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { CageService } from '@shared/services/cage.service';
import { LivestockService } from '@shared/services/livestock.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';
import { GroupCategoryService } from '@shared/services/groupCategory.service';

@Component({
  selector: 'cage',
  templateUrl: './cage.component.html',
  styleUrls: ['./cage.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class CageComponent implements OnInit {
  formCage: FormGroup;
  isLoading = true;  
  cageId = null;  
  regions= [];
  farms = [];
  units = [];
  livestocks = [];
  parentUrl: any[] = ['/master/cage-list'];

  constructor(
    private cageService: CageService,
    private livestockService: LivestockService,
    private groupCategoryService: GroupCategoryService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formCage = this.fb.group({
      cageId: null,
      tag: ['', [Validators.required]],
      region: this.fb.group({
        groupCategoryId: ['', [Validators.required]],
        groupCategoryname: '',
        groupName: ''
      }),
      farm: this.fb.group({
        groupCategoryId: ['', [Validators.required]],
        groupCategoryname: '',
        groupName: ''
      }),
      unit: this.fb.group({
        groupCategoryId: ['', [Validators.required]],
        groupCategoryname: '',
        groupName: ''
      }),
      size: [0, [Validators.min(0)]],
      drinkingCup: [0, [Validators.min(0)]],
      feedingTray: [0, [Validators.min(0)]],
      fan: [0, [Validators.min(0)]],
      livestockType: this.fb.group({
        livestockTypeId: ['', [Validators.required]],
        livestockName: ''
      }),
      notes: ''
    });

  }

  ngOnInit() {
    this.cageId = this.router.snapshot.paramMap.get('id');
    if(this.cageId!=null){
      this.getData();
    }
    this.selectLivestock();
    this.selectRegion();
  }

  selectLivestock() {
    this.isLoading=true;
    this.livestockService.selectAllLivestock().subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          this.livestocks.push(element);
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

  selectRegion() {
    this.isLoading=true;
    this.groupCategoryService.selectGroupCategory(1).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          this.regions.push(element);
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

  selectFarm() {    
    this.isLoading=true;
    for(var i=0; i<this.farms.length;){
      this.farms.pop();      
    }
    this.groupCategoryService.selectGroupCategory(this.formCage.get('region').get('groupCategoryId').value).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          this.farms.push(element);
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

  selectUnit() {
    this.isLoading=true;
    for(var i=0; i<this.units.length;){
      this.units.pop();
    }    
    this.groupCategoryService.selectGroupCategory(this.formCage.get('farm').get('groupCategoryId').value).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          this.units.push(element);
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
    this.cageService.getCage(this.cageId).subscribe(
      data => {
        console.log(data);
        if(data!=null){
          this.formCage.patchValue(data);
          this.selectFarm();
          this.selectUnit();
        } else {
          alert('Data dengan ID '+this.cageId+' tidak ditemukan!');
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
    if(this.formCage.valid){
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;
        this.cageService.saveCage(this.formCage.value).subscribe(
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
      Object.keys(this.formCage.controls).forEach(field => {
        const control = this.formCage.get(field);
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
    this.formCage.reset();    
  }
}
