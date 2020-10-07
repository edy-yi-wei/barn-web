import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'spk-volume',
  templateUrl: './work-volume.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class WorkVolumeComponent implements OnInit {
  @Input() formSpk: FormGroup;  
  @Input('readOnly') readOnly: boolean = false;
  jobs: FormArray;
  columns: string[] = ['jobCode', 'jobDescription', 'uom', 'volume', 'price', 'action'];
  dataSource: MatTableDataSource<any>;
  counter = 1;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.jobs = this.formSpk.get('spkJobs') as FormArray;    
    this.dataSource= new MatTableDataSource((this.jobs).controls);

    this.jobs.valueChanges.subscribe(
      newValue => {
        this.dataSource._updateChangeSubscription();
      }
    );
  }

  removeJob(index: number){
    if(confirm("Yakin akan menghapus baris terpilih ")){      
      this.jobs.removeAt(index);
    }
  }

}
