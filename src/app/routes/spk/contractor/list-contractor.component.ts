import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ContractorService } from '@shared/services/contractor.service';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'spk-contractor',
  templateUrl: './list-contractor.component.html',  
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListContractorComponent implements OnInit { 
  list = [];
  isLoading = true;
  dragging = false;
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

  constructor(
    private contractorService: ContractorService,
    private routing: Router,
    public dialog: MtxDialog
  ) {}

  ngOnInit() {
    this.columns = this.getColumns(
      record => this.edit(record),
      record => this.delete(record)
    );

    this.getData();    
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  addContractor(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['spk/spk-contractor']);
  }

  edit(value: any) {
    this.routing.navigate(['spk/spk-contractor/'+value.contractorId]);
  }

  delete(value: any) {
    this.isLoading=true;
    this.contractorService.deleteContractor(value.contractorId).subscribe(
      data => {
        alert('Data '+data.contractorName+' berhasil dihapus!');
        this.getData();
      },
      error => {
        alert(error);
      },
      () => {
        this.isLoading=false;
      }
    )
  }

  // changeSelect(e: any) {
  //   console.log(e);
  // }

  // changeSort(e: any) {
  //   // console.log(e);    
  //   switch(e.active){
  //     case "contractorName":
  //       this.list.sort((obj1, obj2) => {          
  //         if(obj1.contractorName > obj2.contractorName) {
  //           if(e.direction=='asc'){
  //             return 1;
  //           } else {
  //             return -1;
  //           }
  //         } else {
  //           if(e.direction=='asc'){
  //             return -1;
  //           } else {
  //             return 1;
  //           }
  //         }
  //       });
  //       break;
  //     case "contractorType":
  //       this.list = this.list.sort((obj1, obj2) => {
  //         if(obj1.contractorType > obj2.contractorType) {
  //           if(e.direction=='asc'){
  //             return 1;
  //           } else {
  //             return -1;
  //           }
  //         }
  //       });
  //       break;
  //   }
  //   console.log(this.list);
  // }

  getColumns(fn1: (record: any) => void, fn2: (record: any) => void) {
    this.columns.push({
      title: 'Action',
      index: 'option',
      width: '80px',
      fixed: 'right',
      right: '0px',
      type: 'button',
      checked: true,
      buttons: [
        {
          icon: 'edit',          
          type: 'icon',
          tooltip: 'edit',
          click: fn1,
        },
        {
          icon: 'delete', 
          tooltip: 'hapus',
          color: 'warn',
          type: 'icon',
          pop: true,
          popTitle: 'Yakin dihapus?',
          click: fn2,
        },
      ],
    });
    return this.columns;
  }

  getData() {
    this.isLoading=true;
    this.contractorService.selectContractors(this.searchValue).subscribe(
      data => {
        console.log(data),        
        this.list = data.content;
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
