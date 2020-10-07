import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from '@shared/services/workspace.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceDetailDialogComponent } from './workspace-detail.component';
import { WorkspaceApprovalDialogComponent } from './workspace-approval.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./workspace.component.scss'],  
  changeDetection: ChangeDetectionStrategy.Default,
})

export class InboxComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  btnStatus: boolean = false;
  list: FormArray;
  isLoading = true; 
  columns: string[] = ['check', 'transactionType', 'transactionNumber', 'transactionDate', 'requestor', 'action'];
  dataSource: MatTableDataSource<any>;
  
  searchValue = {
    search: '',    
    transactionCode: ''
  };

  constructor(
    private workspaceService: WorkspaceService,
    private routing: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pager.showFirstLastButtons = true;
    this.pager.pageSize = 10;
    this.pager.pageIndex = 0;
    this.list = this.fb.array([]);
    this.dataSource= new MatTableDataSource((this.list).controls);
    this.getData(this.pager.pageIndex);
  }

  pageClick(event){
    this.getData(event.pageIndex);
  }

  getData(page: number) {
    this.isLoading=true;
    this.workspaceService.selectInbox(this.searchValue, page).subscribe(
      data => {
        if(data!=null){
          console.log(data);
          this.list.clear()
          data.content.forEach(element => {
            this.list.push(this.createInbox(element));
          });
          this.dataSource._updateChangeSubscription();
          this.pager.length = data.totalElements;
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

  fetchNextRow() {
    /*
    * FETCH LAST SINGLE ROW IN CURRENT PAGE
    */
    var page = this.pager.pageIndex;
    this.isLoading=true;
    this.workspaceService.fetchNextRow(this.searchValue, page).subscribe(
      data => {
        if(data!=null){
          console.log(data);                    
          this.list.push(this.createInbox(data));
          this.dataSource._updateChangeSubscription();          
        } else {
          console.log('row null');
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

  createInbox(data){
    return this.fb.group({
      checkStatus: false,
      transactionIdentity: data.transactionIdentity,
      transactionTypeCode: data.transactionTypeCode,
      transactionNumber: data.transactionNumber,
      transactionDate: data.transactionDate,
      requestor: this.fb.group({
        employeeId: data.requestor.employeeId,
        employeeName: data.requestor.employeeName
      })
    });
  }

  showDetail(nilai){
    this.dialog.open(WorkspaceDetailDialogComponent, {
      width: '100%',
      height: '98%',
      data: nilai.value.transactionIdentity
    });
  }
  
  doAction(nilai, index){
    console.log(nilai.value);
    var transaction = nilai.value.transactionIdentity.split(':');
    var result = this.dialog.open(WorkspaceApprovalDialogComponent, {
      data: {
        transactionType: transaction[0],
        transactionId: transaction[1],
        title: nilai.value.transactionNumber +" - "+nilai.value.requestor.employeeName
      }
    });
    result.afterClosed().subscribe(
      data => {
        console.log(data);
        if(data==true){
          this.list.removeAt(index);
          this.pager.length = this.pager.length - 1;
          this.dataSource._updateChangeSubscription();
          this.fetchNextRow();
        }
      }
    );
  }

  approveAll() {
    if(confirm('Apakah Anda yakin akan meng-approve semua pengajuan terpilih?')){
      var list = [];
      this.list.value.forEach(element => {
        if(element.checkStatus){
          var transaction = element.transactionIdentity.split(':');        
          list.push({
            transactionType: transaction[0],
            transactionId: transaction[1]
          })
        }
      });
      this.lockActionButton(true);
      this.isLoading = true;        
      this.workspaceService.approveAll(list).subscribe(
        returnValue => {
          if(returnValue.length==0){
            alert('Pengajuan berhasil di approve!');
          } else {
            alert(returnValue);
          }
          this.isLoading = false;
          this.lockActionButton(false);
          this.cari();
        },
        error => {
          // alert(error);
          console.log(error);
          this.isLoading = false;
          this.lockActionButton(false);
        }
      );        
    }
  }

  rejectAll() {
    if(confirm("Apakah Anda yakin akan me-reject semua pengajuan terpilih?")){
      var list = [];
      this.list.value.forEach(element => {
        if(element.checkStatus){
          var transaction = element.transactionIdentity.split(':');        
          list.push({
            transactionType: transaction[0],
            transactionId: transaction[1]
          })
        }
      });
      this.isLoading = true;
      this.lockActionButton(true);
      this.workspaceService.rejectAll(list).subscribe(
        returnValue => {
          if(returnValue.length==0){
            alert('Pengajuan berhasil di reject!');
          } else {
            alert(returnValue);
          }
          this.isLoading = false;
          this.lockActionButton(false);
          this.cari();
        },
        error => {
          // alert(error);
          console.log(error);
          this.isLoading = false;
          this.lockActionButton(false);
        }
      );    
    }
  }

  cari(){
    this.pager.pageIndex = 0;
    this.getData(this.pager.pageIndex);
  }

  checkAll(event) {
    for(var i=0; i<this.list.length; i++){
      var data = this.list.controls[i];
      data.get('checkStatus').setValue(event.checked);
    }
  }

  lockActionButton(status){
    this.btnStatus = status;
  }
}
