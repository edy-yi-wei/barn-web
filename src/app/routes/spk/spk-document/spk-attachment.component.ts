import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '@shared/services/file.service';
import { SpkService } from '@shared/services/spk.service';

@Component({
  selector: 'spk-attachment',
  templateUrl: './spk-attachment.component.html',
  styleUrls: ['./spk.component.scss']  
})

export class SpkAttachmentComponent implements OnInit {
  @Input() formSpk: FormGroup;
  @Input() attachmentData: FormData;
  @Input('readOnly') readOnly: boolean = false;
  
  startIndexAttachment= 0;
  attachments: FormArray;
  categories: [];
  columns: string[] = ['indexNumber', 'category', 'fileUpload', 'notes', 'action'];
  dataSource: MatTableDataSource<any>;

  constructor(private fb: FormBuilder, private fileService: FileService, private spkService: SpkService) {}

  ngOnInit() {
    this.attachments = this.formSpk.get('attachments') as FormArray;    
    this.dataSource= new MatTableDataSource((this.attachments).controls);

    this.spkService.selectCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.log(error);
        alert(error);
      }
    );

  }
  
  addDefaultAttachmentCategory(spkTypeId) {
    while(this.attachments.length>0){
      this.attachments.removeAt(0);
    }

    this.categories.forEach(element => {
      var nilai = <any>element;
      var apply = nilai.tag.substr(spkTypeId-1, 1);
      if(apply==1){        
        this.attachments.push(this.createDetail(element));
      }
    });
    for(var i=0; i<this.attachments.length; i++){
      var att = this.attachments.controls[i];
      att.get('indexNumber').setValue(i+1);
    }
    this.dataSource._updateChangeSubscription();
  }

  addRow() {
    var data = {};    
    this.attachments.push(this.createDetail(data));
    for(var i=0; i<this.attachments.length; i++){
      var att = this.attachments.controls[i];
      att.get('indexNumber').setValue(i+1);
    }
    this.dataSource._updateChangeSubscription();    
  }

  createDetail(data: any){    
    var hasil = null;
    if(data.spkAttachmentId!=null){ //HASIL LOAD DARI DATABASE
      hasil = this.fb.group({
        spkAttachmentId: data.spkAttachmentId,
        indexNumber: data.indexNumber,
        category: this.fb.group({
          categoryId: [data.category.categoryId, Validators.required],
          category: data.category.category          
        }),
        fileUpload: data.fileUpload!=null? this.fb.group({
          fileUploadId: data.fileUpload.fileUploadId,
          fileLocation: data.fileUpload.fileLocation,
          originalName: data.fileUpload.originalName
        }): this.fb.group({
          fileUploadId: null,
          fileLocation: null,
          originalName: null
        }),
        notes: data.notes
      });
    } else {
      hasil = this.fb.group({ //ADD NEW ATTACHMENT
        spkAttachmentId: data.spkAttachmentId,
        indexNumber: data.indexNumber,
        category: this.fb.group({
          categoryId: [data.categoryId, Validators.required],
          category: data.category          
        }),
        fileUpload: data.needUpload==1? this.fb.group({
          fileUploadId: data.fileUpload!=null? data.fileUpload.fileUploadId: 0,
          fileLocation: data.fileUpload!=null? data.fileUpload.fileLocation: null,
          originalName: data.fileUpload!=null? data.fileUpload.originalName: null
        }): this.fb.group({
          fileUploadId: null,
          fileLocation: null,
          originalName: null
        }),
        notes: data.notes
      });
    }
    return hasil;
  }

  removeDetail(index: number){
    if(confirm("Yakin akan menghapus baris terpilih ")){      
      this.attachments.removeAt(index);
      for(var i=0; i<this.attachments.length; i++){
        var att = this.attachments.controls[i];
        att.get('indexNumber').setValue(i+1);
      }  
      if(i>=this.startIndexAttachment){
        var values = this.attachmentData.getAll('files');
        values.splice((i-this.startIndexAttachment-1), 1);
        this.attachmentData.set('files', values.toString());
      }

      this.dataSource._updateChangeSubscription();
    }
  }

  onAttachmentFileSelect(event) {
    if(event.target.files.length>0){
      var file = event.target.files[0];
      this.attachmentData.append("files", file);
    }
  }

  downloadFile(fileId) {    
    this.fileService.downloadFile(fileId).subscribe(
      response => {
        window.location.href = response.url;
      },
      error => {
        alert(error);
        console.log(error);
      });      
  }

  refreshTable(){
    this.dataSource._updateChangeSubscription();
  }

  removeAttachment(index){
    this.attachments.controls[index].get('spkAttachmentId').setValue(null);
    this.attachments.controls[index].get('fileUpload').get('fileUploadId').setValue(0);
    this.attachments.controls[index].get('fileUpload').get('fileLocation').setValue(null);
    this.attachments.controls[index].get('fileUpload').get('originalName').setValue(null);
  }

  onCategoryChange(index) {    
    var category = this.attachments.controls[index].get('category') as FormGroup;    
    this.categories.forEach(element => {
      var nilai = <any> element;
      if(category.value.categoryId == nilai.categoryId){        
        let fileUpload = this.attachments.controls[index].get('fileUpload') as FormGroup;
        if(nilai.needUpload==1) {
            this.attachments.controls[index].get('spkAttachmentId').setValue(null);
            fileUpload.setValue({
              fileUploadId: 0,
              fileLocation: null,
              originalName: null
            });
        } else {
          fileUpload.setValue({
            fileUploadId: null,
            fileLocation: null,
            originalName: null
          });
        }
      }
    });
  }
  
}
