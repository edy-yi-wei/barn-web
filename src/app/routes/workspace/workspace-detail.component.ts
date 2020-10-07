import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'dialog-workspace-detail',
    styleUrls: ['./workspace.component.scss'],
    templateUrl: 'workspace-detail.component.html',
  })
  export class WorkspaceDetailDialogComponent implements OnInit{
    isLoading = false;
    transactionId: number;
    transactionType: string;

    constructor(@Inject(MAT_DIALOG_DATA) data) {
      var tmp = data.split(':')
      this.transactionType = tmp[0];
      this.transactionId = tmp[1];
     }
  
    ngOnInit() { }
    
  }