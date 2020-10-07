import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyService } from '@shared/services/company.service';
import { PurchaseRequestService } from '@shared/services/purchase-request.service';
import { ChoosePrDialogComponent } from './choose-pr.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'spk-pr',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class PurchaseRequestComponent implements OnInit {
  @Input() formSpk: FormGroup;
  @Input('readOnly') readOnly: boolean = false;
  isLoading = false;  
  prs: FormArray;
  columns: string[] = ['prNo', 'companyName', 'arealName', 'arealLocation', 'action'];
  dataSource: MatTableDataSource<any>;

  constructor(
    public companyService: CompanyService, public prService: PurchaseRequestService, 
    private fb: FormBuilder, public dialog: MatDialog        
  ) {}

  ngOnInit() {
    this.prs = this.formSpk.get('prs') as FormArray;    
    this.dataSource= new MatTableDataSource((this.prs).controls);
    this.formSpk.get('prs').valueChanges.subscribe(
      newValue => {
        this.dataSource._updateChangeSubscription();
      }
    )
  }

  createPR(data: any, spkPrId: number){    
    return this.fb.group({
      spkPrId: spkPrId,
      pr: this.fb.group({
        prId: data.prId,
        prNo: data.prNo,
        company: this.fb.group({
          companyId: data.company.companyId,
          companyName: data.company.companyName
        }),      
        areal: this.fb.group({
          arealId: data.areal.arealId,
          arealName: data.areal.arealName
        }),
        arealLocation: data.arealLocation
      })
    });
  }

  showChoosePRDialog() {
    var isValid = true;
    var hasil = this.dialog.open(ChoosePrDialogComponent);    
    hasil.afterClosed().subscribe(
      async data => {
        if(data!=null){
          this.isLoading = true;
          // console.log(data);
          let pr = await this.prService.getPurchaseRequest(data.prId).toPromise();
          var company = this.formSpk.get('company');
          /* JIKA COMPANY MASIH KOSONG, BERARTI INI PR PERTAMA; AMBIL COMPANY DAN REPRESENTATIVE NYA */
          if(company.get('companyId').value==''){
            company.get('companyId').setValue(data.company.companyId);
            company.get('companyName').setValue(data.company.companyName);
            company.get('companyRepresentatives').setValue([]);
            let data2 = await this.companyService.getCompany(data.company.companyId).toPromise();
            console.log(data2);
            let companyRepresentatives = this.formSpk.get('company').get('companyRepresentatives').value;
            while(companyRepresentatives.length>0){
              companyRepresentatives.pop();
            }
            console.log(companyRepresentatives);
            if(data2.companyRepresentatives!=null && data2.companyRepresentatives.length>0){
              data2.companyRepresentatives.forEach(element => {
                companyRepresentatives.push(element);
              });
            }
            console.log(companyRepresentatives);
            this.formSpk.get('areal').patchValue(data.areal);
            this.formSpk.get('arealLocation').setValue(data.arealLocation);
          } else { /* JIKA INI PR BERIKUTNYA, COMPARASI SUPAYA JANGAN SAMPAI BEDA COMPANY DENGAN PR SEBELUMNYA */
            if(company.get('companyId').value!= data.company.companyId){
              alert('Anda tidak dapat memilih PR yang berbeda PT dengan PR sebelumnya!');
              isValid = false;
            }
          }
          if(!isValid) {
            this.isLoading=false;
            return;
          }

          /* --CHECK PR ALREADY SELECTED-- */
          // this.prs = this.formSpk.get('prs') as FormArray;
          this.prs.value.forEach(element => {
            if(element.pr.prId==data.prId){
              alert('Purchase Request ini sudah Anda pilih!');
              isValid = false;
            }
          });
          
          if(isValid){
            /* --ADD SELECTED PR-- */
            this.prs.push(this.createPR(pr, null));
            // this.dataSource._updateChangeSubscription();
            /* --ADD SPK JOBS FROM SELECTED PR DETAIL-- */
            var prDetails = this.formSpk.get('spkJobs') as FormArray;
            pr.details.forEach(element => {
              prDetails.push(this.createSpkJob(element, pr.prId));
            });
          }
          this.isLoading=false;
        }
      }
    )
  }
  
  createSpkJob(data: any, prId: number){    
    return this.fb.group({
      prDetailId: data.prDetailId,      
      job: this.fb.group({
        jobId: data.job.jobId,
        jobCode: data.job.jobCode,
        jobDescription: data.job.jobDescription,
        uom: [data.job.uom, Validators.required]
      }),            
      volume: [data.volume, Validators.required],
      price: [data.price==null?0:data.price, Validators.required],
      // std: data.std,
      prId: prId
    });
  }

  removePr(index){
    if(confirm("Yakin akan menghapus baris ini?")){
      // var prId = this.prs.get(index).get('prId').value;
      var prId = this.prs.controls[index].get('pr').get('prId').value;
      console.log(this.prs.controls[index].get('pr').get('prId').value);
      this.prs.removeAt(index);
      this.dataSource._updateChangeSubscription();

      /* --REMOVE SPK JOBS FROM DELETED PR-- */
      var jobs = this.formSpk.get('spkJobs') as FormArray;
      for(var i=0; i<jobs.length; i++){
        var element = jobs.value[i];
        if(element.prId==prId){
          jobs.removeAt(i);
          i--;
        }
      }

      if(this.prs.length==0){
        var company = this.formSpk.get('company');
        company.get('companyId').setValue('');
        company.get('companyName').setValue('');
        this.formSpk.get('areal').reset();
        this.formSpk.get('arealLocation').setValue('');
        var companyRepresentatives = this.formSpk.get('company').get('companyRepresentatives').value;
        while(companyRepresentatives.length>0){
          companyRepresentatives.pop();
        }
      }

    }
  }
}
