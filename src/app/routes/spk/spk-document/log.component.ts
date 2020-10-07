import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'spk-log',
  templateUrl: './log.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class LogComponent implements OnInit {
  @Input() formSpk: FormGroup;  
  logs: FormArray;
  columns: string[] = ['no', 'tanggal', 'action', 'notes', 'pic'];
  dataSource: MatTableDataSource<any>;
  counter = 1;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.logs = this.formSpk.get('logs') as FormArray;    
    this.dataSource= new MatTableDataSource((this.logs).controls);

    // this.logs.valueChanges.subscribe(
    //   newValue => {
    //     this.dataSource._updateChangeSubscription();
    //   }
    // );
  }

  refreshTable() {
    this.dataSource._updateChangeSubscription();
  }

  createLog(data){
    return this.fb.group({
      logId: data.logId,
      logOrder: data.logOrder,
      logDate: data.logDate,
      logAction: data.logAction,
      notes: data.notes,
      loginHistory: this.fb.group({
        loginHistoryId: data.loginHistory.loginHistoryId,
        userId: data.loginHistory.userId,
        userName: data.loginHistory.userName,
        loginTime: data.loginHistory.loginTime
      })
    });
  }
}
