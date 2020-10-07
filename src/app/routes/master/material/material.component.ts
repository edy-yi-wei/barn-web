import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { CageService } from '@shared/services/cage.service';
import { LivestockService } from '@shared/services/livestock.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';
import { GroupCategoryService } from '@shared/services/groupCategory.service';
import { MaterialService } from '@shared/services/material.service';
import { MaterialTypeService } from '@shared/services/materialType.service';

@Component({
  selector: 'material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class MaterialComponent implements OnInit {
  formMaterial: FormGroup;
  isLoading = true;  
  materialId = null;  
  types= [];  
  parentUrl: any[] = ['/master/material-list'];

  constructor(
    private materialService: MaterialService,   
    private materialTypeService: MaterialTypeService, 
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formMaterial = this.fb.group({
      materialId: null,
      materialName: ['', [Validators.required]],
      uom: ['', [Validators.required]],
      type: this.fb.group({
        typeId: ['', [Validators.required]],
        typeName: ''        
      }),      
      notes: ''
    });

  }

  ngOnInit() {
    this.materialId = this.router.snapshot.paramMap.get('id');
    if(this.materialId!=null){
      this.getData();
    } else {
      this.selectType();
    }
  }

  selectType() {
    this.isLoading=true;
    for(var i=0; i<this.types.length;){
      this.types.pop();
    }    
    this.materialTypeService.selectAllMaterialType().subscribe(
      data => {
        console.log(data);        
        data.forEach(element => {
          this.types.push(element);
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
    this.materialService.getMaterial(this.materialId).subscribe(
      data => {
        console.log(data);
        if(data!=null){
          this.formMaterial.patchValue(data);
          this.selectType();          
        } else {
          alert('Data dengan ID '+this.materialId+' tidak ditemukan!');
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
    if(this.formMaterial.valid){
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;
        this.materialService.saveMaterial(this.formMaterial.value).subscribe(
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
      Object.keys(this.formMaterial.controls).forEach(field => {
        const control = this.formMaterial.get(field);
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
    this.formMaterial.reset();    
  }
}
