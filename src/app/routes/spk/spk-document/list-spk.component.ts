import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { SpkService } from '@shared/services/spk.service';
import { CompanyService } from '@shared/services/company.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'spk-list',
  templateUrl: './list-spk.component.html',  
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListSpkComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  list = [];
  companies = [];
  isLoading = true; 
  dragging = false;
  columns: string[] = ['spkNumber', 'poNumber', 'spkType', 'company', 'status', 'action'];  

  searchValue = {
    search: '',    
    type: '',
    company: '',
    status: ''
  };

  constructor(
    private spkService: SpkService,
    private companyService: CompanyService,
    private routing: Router,
    public dialog: MtxDialog
  ) {}

  ngOnInit() {    
    this.pager.showFirstLastButtons = true;
    this.getCompanies();
    this.getData(this.pager.pageIndex);
        
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  pageClick(event){
    this.getData(event.pageIndex);
  }

  addSpk(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['spk/spk-document']);
  }

  edit(value: any) {
    this.routing.navigate(['spk/spk-document/'+value.spkId]);
  }

  print(value: any) {
    this.isLoading = true;
    this.spkService.downloadSpk(value.spkId).subscribe(
      response => {
        window.location.href = response.url;
      },
      error => {
        alert(error);
        console.log(error);
      },
      () => {
        this.isLoading = false;
      }
    );      
  }

  delete(value: any) {
    this.isLoading=true;
    this.spkService.deleteSpk(value.spkId).subscribe(
      data => {
        alert('Data '+data.spkNumber+' berhasil dihapus!');
        this.getData(this.pager.pageIndex);
      },
      error => {
        alert(error);
      },
      () => {
        this.isLoading=false;
      }
    )
  }

  getData(page: number) {    
    this.isLoading=true;
    this.spkService.selectSpks(this.searchValue, page).subscribe(
      data => {
        console.log(data);
        this.list = data.content;
        this.pager.length = data.totalElements;
      },
      error => {
        console.log(error)
      },
      () => {
        this.isLoading=false
      }
    );
  }

  getCompanies() {
    this.isLoading = true;
    this.companyService.selectCompanies('').subscribe(
      data => {
        console.log(data);
        this.companies = data;
        this.companies.forEach(element => {
          element.companyName = element.companyName.replace("PT ","").replace("PT. ","");
        });
        this.companies.sort((obj1, obj2) => {          
        if(obj1.companyName > obj2.companyName) {
          return 1;
        } else {
          return -1;
        }
      });
      },
      error => {
        console.log(error);
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  cari() {
    this.pager.pageIndex = 0;
    this.getData(this.pager.pageIndex);
  }
}
