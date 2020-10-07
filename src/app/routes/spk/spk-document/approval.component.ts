import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'spk-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class ApprovalComponent implements OnInit {
  @Input() formSpk: FormGroup;  
  approvals: FormArray;
  columns: string[] = ['approver', 'position', 'action', 'date', 'notes', 'status'];
  dataSource: MatTableDataSource<any>;  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.approvals = this.formSpk.get('approvals') as FormArray;    
    this.dataSource= new MatTableDataSource((this.approvals).controls);
  }

  refreshTable() {
    this.dataSource._updateChangeSubscription();
  }

  createApproval(data){
    return this.fb.group({
      approvalId: data.approvalId,
      approvalOrder: data.approvalOrder,
      approvalDate: data.approvalDate,
      approvalAction: data.approvalAction,
      notes: data.notes,
      approver: this.fb.group({
        employeeId: data.approver.employeeId,
        employeeNumber: data.approver.employeeNumber,
        employeeName: data.approver.employeeName
      }),
      position: this.fb.group({
        positionId: data.position.positionId,
        positionCode: data.position.positionCode,
        positionName: data.position.positionName
      })
    });
  }
}
