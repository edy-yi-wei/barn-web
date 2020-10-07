import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from '@shared/services/workspace.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceDetailDialogComponent } from './workspace-detail.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./workspace.component.scss'],  
  changeDetection: ChangeDetectionStrategy.Default,
})

export class OutboxComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;
  
  list: FormArray;
  isLoading = true; 
  columns: string[] = ['transactionType', 'transactionNumber', 'transactionDate', 'requestor', 'action'];
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
    this.workspaceService.selectOutbox(this.searchValue, page).subscribe(
      data => {
        if(data!=null){
          console.log(data);
          this.list.clear()
          data.content.forEach(element => {
            this.list.push(this.createOutbox(element));
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

  createOutbox(data){
    return this.fb.group({
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
  
  cari(){
    this.pager.pageIndex = 0;
    this.getData(this.pager.pageIndex);
  }
}
