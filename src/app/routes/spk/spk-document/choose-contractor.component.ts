import { Component, OnInit } from '@angular/core';
import { ContractorService } from '@shared/services/contractor.service';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'dialog-choose-contractor',
    styleUrls: ['./spk.component.scss'],
    templateUrl: 'choose-contractor.component.html',
  })
  export class ChooseContractorDialogComponent implements OnInit{
    isLoading = false;  
    listContractors = [];
    columns: MtxGridColumn[] = [
        { title: 'Nama', index: 'contractorName', width: 'auto' },
        { title: 'Tipe', index: 'contractorType', width: '100px' },
        { title: 'Klasifikasi', index: 'classification', width: '120px' },
        { title: 'Kota', index: 'city', width: '200px' },
        { title: 'PKP', index: 'pkp', width: '50px', type: 'format', format: (data: any) => data.pkp==true?'Ya': 'Tidak' }
    ];  
    searchValue = {
      search: '',    
      classification: ''
    };
  
    constructor(private contractorService: ContractorService, private dialogRef: MatDialogRef<ChooseContractorDialogComponent>) { }
  
    ngOnInit() {

        this.columns = this.getColumns(
            record => this.chooseContractor(record),
        );
        
        this.getContractors();
    
    }
    chooseContractor(data){
        this.dialogRef.close(data);        
    }

    getContractors() {
        this.isLoading=true;
        this.contractorService.selectContractors(this.searchValue).subscribe(
          data => {
            console.log(data),        
            this.listContractors = data.content;
          },
          error => {
            console.log(error)
          },
          () => {
            this.isLoading=false
          }
        );
    }

    getColumns(fn1: (record: any) => void) {
        this.columns.push({
          title: 'Action',
          index: 'option',
          width: '40px',
          fixed: 'right',
          right: '0px',
          type: 'button',
          checked: true,
          buttons: [
            {
              icon: 'edit',          
              type: 'icon',
              tooltip: 'choose',
              click: fn1,
            }        
          ],
        });
        return this.columns;
      }
  }