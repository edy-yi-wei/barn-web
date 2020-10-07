import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'spk-volume-extend',
  templateUrl: './work-volume-extend.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class WorkVolumeExtendComponent implements OnInit {
  @Input() formSpk: FormGroup;  
  @Input('readOnly') readOnly: boolean = false;
  jobs: FormArray;
  columns: string[] = ['orderNumber', 'jobDescription', 'uom', 'volume', 'price', 'action'];
  dataSource: MatTableDataSource<any>;
  counter = 1;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.jobs = this.formSpk.get('spkJobsExtend') as FormArray;    
    this.dataSource= new MatTableDataSource((this.jobs).controls);

    // this.jobs.valueChanges.subscribe(
    //   newValue => {
    //     this.dataSource._updateChangeSubscription();
    //   }
    // );
  }

  addRow() {
    var data = {};    
    this.jobs.push(this.createDetail(data));
    for(var i=0; i<this.jobs.length; i++){
      var d = this.jobs.controls[i];
      d.get('orderNumber').setValue(i+1);
    }  
    this.dataSource._updateChangeSubscription();    
  }

  createDetail(data: any){
    return this.fb.group({
      spkJobExtendId: data.spkJobExtendId,
      orderNumber: data.orderNumber,
      jobDescription: [data.jobDescription, Validators.required],
      uom: data.uom,
      volume: data.volume,
      price: data.price,
    });
  }

  removeJob(index: number){
    if(confirm("Yakin akan menghapus baris terpilih ")){      
      this.jobs.removeAt(index);
    }
    for(var i=0; i<this.jobs.length; i++){
      var d = this.jobs.controls[i];
      d.get('orderNumber').setValue(i+1);
    }
    this.dataSource._updateChangeSubscription();
  }

  refreshTable() {
    this.dataSource._updateChangeSubscription();
  }
}
