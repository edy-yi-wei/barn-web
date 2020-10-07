import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '@shared/services/file.service';
import { SpkService } from '@shared/services/spk.service';

@Component({
  selector: 'spk-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class WorkDetailComponent implements OnInit {
  @Input() formSpk: FormGroup;
  @Input('readOnly') readOnly: boolean = false;
  isLoading = false;
  jobDetails: FormArray;
  columns: string[] = ['indexNumber', 'category', 'jobName', 'uom', 'volume', 'price', 'action'];
  dataSource: MatTableDataSource<any>;
  constructor(private fb: FormBuilder, private fileService: FileService, private spkService: SpkService) {}

  ngOnInit() {
    this.jobDetails = this.formSpk.get('jobDetails') as FormArray;    
    this.dataSource= new MatTableDataSource((this.jobDetails).controls);

    this.jobDetails.valueChanges.subscribe(
      newValue => {
        this.dataSource._updateChangeSubscription();
      }
    );
  }

  addRow() {
    var data = {};    
    this.jobDetails.push(this.createDetail(data));
    this.dataSource._updateChangeSubscription();    
  }

  createDetail(data: any){
    return this.fb.group({
      jobDetailId: data.jobDetailId,
      orderNumber: data.orderNumber,
      indexNumber: [data.indexNumber, Validators.required],
      category: [data.category, Validators.required],
      jobName: [data.jobName, Validators.required],
      uom: data.uom,
      volume: data.volume,
      price: data.price,
    });
  }

  removeDetail(index: number){
    if(confirm("Yakin akan menghapus baris terpilih ")){      
      this.jobDetails.removeAt(index);
      this.dataSource._updateChangeSubscription();
    }
  }

  async onFileUpload(event) {
    if(event.target.files.length>0){
      var file = event.target.files[0];
      var attachedFile = new FormData();
      attachedFile.append("files", file);

      this.isLoading = true;
      let data = await this.fileService.uploadFile(attachedFile).toPromise();      
      console.log(data);
      if(data!=null){
        this.isLoading = true;
        this.spkService.readWorkDetail(data[0].fileUploadId).subscribe(
          result => {
            result.forEach(element => {
              this.jobDetails.push(this.createDetail(element));
            });
            this.dataSource._updateChangeSubscription();
          },
          error => {
            console.log(error);
            alert(error);
          },
          () => {
            this.isLoading=false;
          }
        );

      } else {
        alert('Gagal melakukan upload file');
        this.isLoading = false;
      }
    }
  }
}
