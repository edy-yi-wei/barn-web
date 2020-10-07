import { Component, OnInit } from '@angular/core';
import { ContractorService } from '@shared/services/contractor.service';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from '@shared/services/purchase-request.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder } from '@angular/forms';


@Component({
    selector: 'dialog-choose-pr',
    styleUrls: ['./spk.component.scss'],
    templateUrl: 'choose-pr.component.html',
  })
  export class ChoosePrDialogComponent implements OnInit{
    isLoading = false;  
    listPrs: any = [];
    columns: string[] = [ 'prNo', 'companyName', 'arealName', 'action' ];  
    searchValue = {
      search: ''
    };
    dataSource: MatTableDataSource<any>;
    
    constructor(private prService: PurchaseRequestService, private fb: FormBuilder,
      private dialogRef: MatDialogRef<ChoosePrDialogComponent>) { }
  
    ngOnInit() {
        this.selectPrs();
        // this.listPrs = new FormArray([]);
        this.dataSource= new MatTableDataSource((this.listPrs));
    }
    choosePr(data){
        this.dialogRef.close(data);        
    }

    selectPrs() {
        this.isLoading=true;
        this.prService.selectPurchaseRequest(1, this.searchValue.search).subscribe(
          data => {
            while(this.listPrs.length>0){
              this.listPrs.pop();
            }
            data.content.forEach(element => {
              // console.log(element);
              // var isi = this.fb.group({
              //   prId: element.prId,
              //   prNo: element.prNo,
              //   company: this.fb.group({
              //     companyId: element.company.companyId,
              //     companyName: element.company.companyName
              //   }),
              //   areal: this.fb.group({
              //     arealId: element.areal.arealId,
              //     arealName: element.areal.arealName
              //   })
              // });
              this.listPrs.push(element);
            }),
            // console.log(this.listPrs);
            this.dataSource._updateChangeSubscription()
          },
          error => {
            console.log(error)
          },
          () => {
            this.isLoading=false
          }
        );
    }
    
  }