import { Component, OnInit, ViewChild, ElementRef, ComponentRef, AfterViewInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SpkService } from '@shared/services/spk.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS} from '@shared/components/date.adapter';
import { SpkContractor } from '@shared/models/SpkContractor';
import { Witness } from '@shared/models/Witness';
import { ContractorService } from '@shared/services/contractor.service';
import { ChooseContractorDialogComponent } from './choose-contractor.component';
import { PurchaseRequestComponent } from './purchase-request.component';
import { CompanyService } from '@shared/services/company.service';
import { PurchaseRequestService } from '@shared/services/purchase-request.service';
import { WorkDetailComponent } from './work-detail.component';
import { SpkAttachmentComponent } from './spk-attachment.component';
import { WorkVolumeExtendComponent } from './work-volume-extend.component';
import { FileService } from '@shared/services/file.service';
import { LogComponent } from './log.component';
import { ApprovalComponent } from './approval.component';

@Component({
  selector: 'spk-document',
  templateUrl: './spk.component.html',
  styleUrls: ['./spk.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class SpkComponent implements OnInit {
  @ViewChild(SpkAttachmentComponent) attachmentComponent: SpkAttachmentComponent;
  @ViewChild(WorkVolumeExtendComponent) workvolumeExtendComponent: WorkVolumeExtendComponent;
  @ViewChild(WorkDetailComponent) workDetailComponent: WorkDetailComponent;
  @ViewChild(PurchaseRequestComponent) prComponent: PurchaseRequestComponent;
  @ViewChild(LogComponent) logComponent: LogComponent;
  @ViewChild(ApprovalComponent) approvalComponent: ApprovalComponent;
  @Input('spkId') spkId = null;
  @Input('viewOnly') viewOnly: boolean = false;
  formSpk: FormGroup;
  attachmentData = new FormData();
  isLoading = false;  
  // spkId = null;
  dataSource: MatTableDataSource<any>;
  parentUrl: any[] = ['/spk/spk-document-list'];
  companyRepresentatives = [];
  contractors = [];
  contractorPics: any = [];
  cs: any;
  contractor1: any;
  contractor2: any;
  witness1: any;
  witness2: any;
  witness3: any;
  btnStatus: boolean = false;
  readOnly: boolean = true;
  // viewOnly: boolean = false;  //VIEW DARI WORKSPACE
  
  constructor(
    private spkService: SpkService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routing: Router,
    private fileService: FileService,
    public dialog: MatDialog,
    public contractorService: ContractorService,
    public companyService: CompanyService,
    public prService: PurchaseRequestService,
  ) {
    this.formSpk = this.fb.group({
      spkId: null,
      spkNumber: { value: '', disabled: true },
      spkType: fb.group({
        spkTypeId: [{ value: '0'}, Validators.min(1)],
      }),
      prs: fb.array([]),
      poNumber: ['', Validators.required],
      poRetensiNumber: '',
      spkDate: { value: new Date(), disabled: true },
      company: fb.group({
        companyId: '',
        companyName: { value: '', disabled: true },
        companyRepresentatives: [] 
      }),
      companyRepresentative: [{value: 0}, Validators.min(1)],
      areal: fb.group({
        arealId: 0,
        arealName: {value: '', disabled: true}
      }),
      arealLocation: {value: '', disabled: true},
      contractors: fb.array([]),
      spkTitle: ['', Validators.required],
      signedLocation: ['', Validators.required],
      signedDate: ['', Validators.required],
      jobSummary: ['', Validators.required],
      startContract: ['', Validators.required],
      endContract: ['', Validators.required],
      bank: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      bankAccountName: ['', Validators.required],
      retensiValue: [0, Validators.required],
      retensiPeriod: ['', Validators.required],
      courtLocation: ['', Validators.required],
      termOfPayment: ['', Validators.required],
      performanceWarranty: ['', Validators.required],
      lateCharge: ['', Validators.required],
      others: '',
      // flowId: [0, Validators.min(1)],
      totalWorkVolume: 0,
      witnesses: fb.array([]),      
      spkJobs: fb.array([]),
      spkJobsExtend: fb.array([]),
      jobDetails: fb.array([]),
      attachments: fb.array([]),
      logs: fb.array([]),
      approvals: fb.array([]),
      amandemens: [],
      amandemenEndContract: {value: null, disabled: true},
      status: this.fb.group({
        statusId: 0,
        statusName: ''
      }),
      created: this.fb.group({
        loginHistoryId: null,
        userName: null
      }),
      createdDate: null,
      modified: this.fb.group({
        loginHistoryId: null,
        userName: null
      }),
      modifiedDate: null
    });

  }

  ngOnInit() {
    /* --INITIALIZE CONTRACTOR DATA-- */
    this.cs = this.formSpk.get('contractors') as FormArray;    
    this.contractor1 = this.createContractor(new SpkContractor(0, null, 0));
    this.contractor2 = this.createContractor(new SpkContractor(null, null, 0));
    this.cs.push(this.contractor1);
    this.cs.push(this.contractor2);
    // var pic1 = [];
    // var pic2 = [];
    // this.contractorPics.push(pic1);
    // this.contractorPics.push(pic2);

    /* --INITIALIZE WITNESSES DATA-- */
    var w = this.formSpk.get('witnesses') as FormArray;
    this.witness1 = this.createWitness(new Witness(null, '', ''));
    this.witness2 = this.createWitness(new Witness(null, '', ''));
    this.witness3 = this.createWitness(new Witness(null, '-', '-'));
    w.push(this.witness1);
    w.push(this.witness2);
    w.push(this.witness3);
    w.controls[2].get('witness').disable();
    w.controls[2].get('witnessPosition').disable();
    
    
    this.formSpk.get('company').get('companyRepresentatives').valueChanges.subscribe(
      newValue => {
        this.companyRepresentatives = this.formSpk.get('company').get('companyRepresentatives').value;
      }
    );
    
    // this.formSpk.get('spkType').get('spkTypeId').valueChanges.subscribe(
    //   newValue => {
    //     if(newValue!=0){
    //       this.resetSpkType();
    //     }
    //   }
    // );
    // this.formSpk.get('contractors').valueChanges.subscribe(
    //   newValue => {
    //     this.contractors = this.formSpk.get('contractors').value;
    //   }
    // );
    
    if(this.spkId==null){
      this.spkId = this.router.snapshot.paramMap.get('id');
      if(this.spkId!=null){
        this.getData();
      } else {
        this.readOnly = false;
      }
    } else {
      this.getData();
    }
  }

  createContractor(data: any){    
    return this.fb.group({
      contractor: this.fb.group({
        contractorId: data.contractorId,
        contractorName: data.contractorName,
        pics: []
      }),
      contractorPicId: data.contractorPicId
    });
  }

  createWitness(data: any){    
    return this.fb.group({
      witnessId: data.witnessId,
      witness: [data.witness, Validators.required],
      witnessPosition: [data.witnessPosition, Validators.required]
    });
  }


  async getData() {
    this.isLoading=true;
    let data = await this.spkService.getSpk(this.spkId).toPromise();
    console.log(data);
    if(data!=null){
      if((data.status.statusId==1 || data.status.statusId==4) && this.viewOnly==false){
        this.readOnly = false;
      } else {
        this.readOnly =  true;        
      }
      this.formSpk.patchValue(data);
      if(data.spkDate!=null){
        this.formSpk.get('spkDate').setValue(new Date(data.spkDate));
      }
      if(data.signedDate!=null){
        this.formSpk.get('signedDate').setValue(new Date(data.signedDate));
      }
      if(data.startContract!=null){
        this.formSpk.get('startContract').setValue(new Date(data.startContract));
      }
      if(data.endContract!=null){
        this.formSpk.get('endContract').setValue(new Date(data.endContract));
      }
      
      var prs = this.formSpk.get('prs') as FormArray;
      while(prs.length>0){
        prs.removeAt(0);
      }
      // let spkPr = new PurchaseRequestComponent(this.companyService, this.prService, this.fb, this.dialog);
      data.prs.forEach(element => {
        prs.push(this.prComponent.createPR(element.pr, element.spkPrId));
      });          

      var volumes = this.formSpk.get('spkJobs') as FormArray;
      while(volumes.length>0){
        volumes.removeAt(0);
      }          
      data.spkJobs.forEach(element => {
        volumes.push(this.prComponent.createSpkJob(element, element.prId));
      });
      // spkPr = null;          

      var logs = this.formSpk.get('logs') as FormArray;
      while(logs.length>0){
        logs.removeAt(0);
      }
      data.logs.forEach(element => {
        logs.push(this.logComponent.createLog(element));
      });
      this.logComponent.refreshTable();

      var approvals = this.formSpk.get('approvals') as FormArray;
      while(approvals.length>0){
        approvals.removeAt(0);
      }
      if(data.approvals.length>0){
        data.approvals.forEach(element => {
          approvals.push(this.approvalComponent.createApproval(element));
        });
        this.approvalComponent.refreshTable();
      } else {
        if(!this.viewOnly){
          this.getApprovalFlow(data.spkType.spkTypeId);
        }
      }      

      var details = this.formSpk.get('jobDetails') as FormArray;
      while(details.length>0){
        details.removeAt(0);
      }
      
      // let spkDetail = new WorkDetailComponent(this.fb, null);
      data.jobDetails.forEach(element => {
        details.push(this.workDetailComponent.createDetail(element));
      });
      // spkDetail = null;

      var atts = this.formSpk.get('attachments') as FormArray;
      while(atts.length>0){
        atts.removeAt(0);
      }
      data.attachments.forEach(element => {
        atts.push(this.attachmentComponent.createDetail(element));
      });
      this.attachmentComponent.refreshTable();

      if(data.spkJobsExtend.length>0 && data.spkType.spkTypeId>1){
        var wvExtends = this.formSpk.get('spkJobsExtend') as FormArray;
        while(wvExtends.length>0){
          wvExtends.removeAt(0);
        }              
        await this.sleep(1500); //SUPAYA VIEW MUNCUL DULU
        data.spkJobsExtend.forEach(element => {
          wvExtends.push(this.workvolumeExtendComponent.createDetail(element));
        });
        this.workvolumeExtendComponent.refreshTable();
      }
      
      var c = this.formSpk.get('contractors') as FormArray;      
      if(c.length>1 && c.controls[1].get('contractor').get('contractorId').value>0){
        var w = this.formSpk.get('witnesses') as FormArray;
        w.controls[2].get('witness').enable();
        w.controls[2].get('witnessPosition').enable();
      }
    } else {
      alert('Data SPK dengan ID '+this.spkId+' tidak ditemukan!');
    }
    if(this.readOnly){
      this.formSpk.disable();      
    }
    this.isLoading=false
  }

  async save(action) {    
    if(this.formSpk.valid){
      var attachmentCount = 0;
      this.attachmentData.forEach(element => {
        attachmentCount++;
      });
      if(confirm('Apakah Anda yakin akan menyimpan data ini?')){        
        this.isLoading = true;
        this.lockActionButton(true);

        if(attachmentCount>0){
          let data2 = await this.fileService.uploadFile(this.attachmentData).toPromise();
          console.log(data2);
          var attachments = this.formSpk.get('attachments') as FormArray;
          var attIndexNumber = 0;

          for(var i=0; i<attachments.length; i++){
            var element = attachments.controls[i];
            if(element.get('fileUpload').get('fileUploadId').value!=null){ //NULL == TIDAK BUTUH ATTACHMENT
              if(element.get('spkAttachmentId').value == null){
                var attId = data2[attIndexNumber++].fileUploadId;
                element.get('fileUpload').get('fileUploadId').setValue(attId);
              }
            }
          }
        }

        if(this.attachmentValid()){
          console.log('valid');
          console.log(this.formSpk.getRawValue());
          this.spkService.saveSpk(this.formSpk.getRawValue(), action).subscribe(
            data => {
              alert(data[0]);
              this.routing.navigate(this.parentUrl);
              this.isLoading = false;
              this.lockActionButton(false);
            },
            error => {
              // alert(error[0]);
              console.log(error);
              this.isLoading = false;
              this.lockActionButton(false);
            }            
          );
        } else {
          alert('Ada file attachment yang belum diupload!');
          this.isLoading = false;
          this.lockActionButton(false);
        }
      }
    } else {
      Object.keys(this.formSpk.controls).forEach(field => {
        const control = this.formSpk.get(field);        
        if (control instanceof FormControl) {          
          control.markAsTouched({ onlySelf: true });
        } else if(control instanceof FormGroup){
          Object.keys(control.controls).forEach(subField => {
            const sub = control.get(subField);
            if(sub instanceof FormControl){
              sub.markAsTouched({onlySelf: true});
            }
          });
        }
      });

      if(this.contractor1.get('contractor').get('contractorName').value==null){
        this.contractor1.get('contractor').get('contractorName').setErrors({notMatched: true});
      }
      if(this.contractor1.get('contractorPicId').value==0){
        this.contractor1.get('contractorPicId').setErrors({notMatched: true});
      }
      if(this.contractor2.get('contractor').get('contractorName').value!=null && this.contractor2.get('contractorPicId').value==0){
        this.contractor2.get('contractorPicId').setErrors({notMatched: true});
      }
      this.contractor1.get('contractor').get('contractorName').markAsTouched({onlySelf: true});
      this.contractor1.get('contractorPicId').markAsTouched({onlySelf: true});
      this.contractor2.get('contractorPicId').markAsTouched({onlySelf: true});

      var witness = this.formSpk.get('witnesses') as FormArray;
      if(witness!=null && witness.length>0){
        for(var i=0; i<witness.controls.length; i++){
          var tmp = witness.controls[i] as FormGroup;
          Object.keys(tmp.controls).forEach(field => {
              const control = tmp.get(field);
              if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
              }
            }
          );
        }
      }

      //VALIDASI VOLUME PEKERJAAN
      var spkJobs = this.formSpk.get('spkJobs') as FormArray;
      if(spkJobs!=null && spkJobs.length>0){
        for(var i=0; i<spkJobs.controls.length; i++){
          var tmp = spkJobs.controls[i] as FormGroup;
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

  // addRow() {
  //   var data = {};    
  //   this.pics.push(this.createPic(data));
  //   this.dataSource._updateChangeSubscription();    
  // }

  // createPic(data: any){
  //   return this.fb.group({
  //     contractorPicId: data.contractorPicId,
  //     name: [data.name, [Validators.required]],
  //     position: [data.position, [Validators.required]],
  //     birthPlace: data.birthPlace,
  //     birthDate: data.birthDate!=null? new Date(data.birthDate): null,
  //     idNumber: data.idNumber,
  //     idExpiredDate: data.idExpiredDate!=null? new Date(data.idExpiredDate): null,
  //     nationality: data.nationality
  //   });
  // }

  // removeRow(index) {
  //   this.pics.removeAt(index);
  //   this.dataSource._updateChangeSubscription();
  // }

  reset() {
    this.formSpk.reset();
    // while(this.pics!=null && this.pics.length>0){
    //   this.pics.removeAt(0);
    // }
    // this.dataSource._updateChangeSubscription();
  }

  confirmChange() {
    alert("Mengganti Jenis SPK akan mengubah struktur SPK!\nAda beberapa data yang mungkin akan terhapus!");
  }

  resetSpkType() {    
    var spkTypeId = this.formSpk.get('spkType').get('spkTypeId').value;
    this.attachmentComponent.addDefaultAttachmentCategory(spkTypeId);
    this.getApprovalFlow(spkTypeId);
  }

  openChooseContractor(index) {
    var hasil = this.dialog.open(ChooseContractorDialogComponent);    
    hasil.afterClosed().subscribe(
      async data => {
        let con = await this.contractorService.getContractor(data.contractorId).toPromise();
        if(index==1){
          this.contractor1.get('contractor').patchValue(con);
          this.contractor1.get('contractorPicId').setValue(0);
        } else {
          this.contractor2.get('contractor').patchValue(con);
          this.contractor2.get('contractorPicId').setValue(0);
          var w = this.formSpk.get('witnesses') as FormArray;
          w.controls[2].get('witness').enable();
          w.controls[2].get('witness').setValue('');
          w.controls[2].get('witnessPosition').enable();
          w.controls[2].get('witnessPosition').setValue('');
        }
      }
    )
  }
  
  clearContractor(index){
    // if(index==1){
    //   this.contractor1 = this.createContractor(new SpkContractor(0, '', 0));    
    // } else {
    //   this.contractor2 = this.createContractor(new SpkContractor(null, '', 0));
    // }
    if(index==1){
      this.contractor1.reset();
    } else {
      this.contractor2.reset();
      var w = this.formSpk.get('witnesses') as FormArray;
      w.controls[2].get('witness').disable();
      w.controls[2].get('witness').setValue('-');
      w.controls[2].get('witnessPosition').disable();
      w.controls[2].get('witnessPosition').setValue('-');
    }
  }

  sleep(ms){
    return new Promise(r => setTimeout(r, ms));
  }

  attachmentValid(): boolean {
    var result = true;
    var att = this.formSpk.get('attachments') as FormArray;
    att.value.forEach(element => {
      // console.log(element);
      if(element.fileUpload.fileUploadId!=null && element.fileUpload.fileUploadId==0){        
        result = false;
      }
    });
    return result;
  }

  lockActionButton(status){
    this.btnStatus = status;
  }

  getApprovalFlow(spkTypeId){
    this.isLoading = true;
    this.spkService.getApprovalFlow(spkTypeId).subscribe(
      data => {
        console.log(data);
        var approvals = this.formSpk.get('approvals') as FormArray;
        while(approvals.length>0){
          approvals.removeAt(0);
        }
        if(data!=null){
          data.details.forEach(element => {
            var tmp = {
              approvalOrder: element.orderNumber,
              approver: {
                employeeId: element.approver.employeeId,
                employeeNumber: element.approver.employeeNumber,
                employeeName: element.approver.employeeName
              },
              position: {
                positionId: element.approver.positionId,
                positionCode: element.approver.positionCode,
                positionName: element.approver.positionName
              }
            }
            approvals.push(this.approvalComponent.createApproval(tmp));
            this.approvalComponent.refreshTable();
          });
        }
      },
      error => {
        console.log(error);
        alert("error "+error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  
}


