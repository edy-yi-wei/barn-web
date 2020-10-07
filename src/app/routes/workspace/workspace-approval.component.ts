import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from '@shared/services/workspace.service';

@Component({
    selector: 'dialog-workspace-approval',
    styleUrls: ['./workspace.component.scss'],
    templateUrl: 'workspace-approval.component.html',
  })
  export class WorkspaceApprovalDialogComponent implements OnInit{
    isLoading = false;
    title: string = ''
    approvalNotes: string = '';
    transactionType: string = '';
    transactionId: number; 

    constructor(@Inject(MAT_DIALOG_DATA) data, private workspaceService: WorkspaceService, 
      private dialogRef: MatDialogRef<WorkspaceApprovalDialogComponent>) {
      this.title = data.title;
      this.transactionId = data.transactionId;
      this.transactionType = data.transactionType;
    }
  
    ngOnInit() {       
    }
    
    approve() {
      if(confirm("Apakah Anda yakin akan meng-approve pengajuan ini?")){
        this.isLoading = true;
        this.workspaceService.approve(this.transactionType, this.transactionId, this.approvalNotes).subscribe(
          (returnValue) => {
            alert(returnValue[0]);
            this.dialogRef.close(true);
          },
          errorValue => {
            alert(errorValue);
            this.isLoading = false;
          }          
        );
      }
    }

    reject() {
      if(confirm("Apakah Anda yakin akan me-reject pengajuan ini?")){
        this.isLoading = true;        
        this.workspaceService.reject(this.transactionType, this.transactionId, this.approvalNotes).subscribe(
          returnValue => {
            alert(returnValue[0]);
            this.dialogRef.close(true);
          },
          error => {
            alert(error);
            this.isLoading = false;
          }
        );        
      }
    }

    chipClick(notes){
      this.approvalNotes = notes;
    }
  }