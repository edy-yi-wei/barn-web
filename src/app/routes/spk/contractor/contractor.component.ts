import { Component, OnInit } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { ContractorService } from '@shared/services/contractor.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@shared/components/date.adapter';

@Component({
  selector: 'spk-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]  
})

export class ContractorComponent implements OnInit {
  formContractor: FormGroup;
  isLoading = true;  
  contractorId = null;
  pics: FormArray;
  picColumns: string[] = ['name', 'position', 'birthPlace', 'birthDate', 'idNumber', 'idExpiredDate', 'nationality', 'action'];
  dataSource: MatTableDataSource<any>;
  parentUrl: any[] = ['/spk/spk-contractor-list'];

  constructor(
    private contractorService: ContractorService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    public dialog: MtxDialog        
  ) {
    this.formContractor = this.fb.group({
      contractorId: null,
      contractorName: ['', [Validators.required]],
      contractorType: ['', [Validators.required]],
      address: '',
      city: '',
      telp: '',
      sbujkStartDate: ['', [Validators.required]],
      sbujkEndDate: ['', [Validators.required]],
      classification: ['', [Validators.required]],
      taxNumber: '',
      pph4Value: '',
      spm: false,
      pkp: false,
      notes: '',
      pics: fb.array([])
    });

  }

  ngOnInit() {
    this.contractorId = this.router.snapshot.paramMap.get('id');
    if(this.contractorId!=null){
      this.getData();
    }
    this.pics = this.formContractor.get('pics') as FormArray;    
    this.dataSource= new MatTableDataSource((this.pics).controls);
  }

  getData() {
    this.isLoading=true;
    this.contractorService.getContractor(this.contractorId).subscribe(
      data => {
        console.log(data);
        if(data!=null){
          this.formContractor.patchValue(data);
          if(data.sbujkStartDate!=null){
            this.formContractor.get('sbujkStartDate').setValue(new Date(data.sbujkStartDate));
          }
          if(data.sbujkEndDate!=null){
            this.formContractor.get('sbujkEndDate').setValue(new Date(data.sbujkEndDate));
          }
          if(data.pics!=null && data.pics.length>0){
            data.pics.forEach(element => {
              this.pics.push(this.createPic(element));
            });
            this.dataSource._updateChangeSubscription();
          }
        } else {
          alert('Data Kontraktor dengan ID '+this.contractorId+' tidak ditemukan!');
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
    if(this.formContractor.valid){
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){
        this.isLoading = true;
        this.contractorService.saveContractor(this.formContractor.value).subscribe(
          data => {
            alert(data[0]);
            this.reset();
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
      Object.keys(this.formContractor.controls).forEach(field => {
        const control = this.formContractor.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      if(this.pics!=null && this.pics.length>0){
        for(var i=0; i<this.pics.controls.length; i++){
          var tmp = this.pics.controls[i] as FormGroup;
          Object.keys(tmp.controls).forEach(field => {
              const control = tmp.get(field);
              if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
              }
            }
          );
        }
      }
      alert('Field dengan tanda bintang wajib diisi!\nSilahkan diperiksa kembali');
    }
  }

  back() {
    this.routing.navigate(this.parentUrl);
  }

  addRow() {
    var data = {};    
    this.pics.push(this.createPic(data));
    this.dataSource._updateChangeSubscription();    
  }

  createPic(data: any){
    // var cPicId = null;
    // if(data.contractorPicId!=null){
    //   cPicId = data.contractorPicId;
    // }    
    return this.fb.group({
      contractorPicId: data.contractorPicId,
      name: [data.name, [Validators.required]],
      position: [data.position, [Validators.required]],
      birthPlace: data.birthPlace,
      birthDate: data.birthDate!=null? new Date(data.birthDate): null,
      idNumber: data.idNumber,
      idExpiredDate: data.idExpiredDate!=null? new Date(data.idExpiredDate): null,
      nationality: data.nationality
    });
  }

  removeRow(index) {
    this.pics.removeAt(index);
    this.dataSource._updateChangeSubscription();
  }

  reset() {
    this.formContractor.reset();
    while(this.pics!=null && this.pics.length>0){
      this.pics.removeAt(0);
    }
    this.dataSource._updateChangeSubscription();
  }
}
