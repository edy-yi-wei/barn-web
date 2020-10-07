import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialService } from '@shared/services/material.service';
import { LivestockService } from '@shared/services/livestock.service';

@Component({
  selector: 'livestock-list',
  templateUrl: './list-livestock.component.html',
  styleUrls: ['./livestock.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListLivestockComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  list = [];  
  isLoading = true; 
  dragging = false;
  columns: string[] = ['name', 'notes', 'action'];

  searchValue = {
    search: ''    
  };

  constructor(
    private livestockService: LivestockService,    
    private routing: Router,
    public dialog: MtxDialog
  ) {}

  ngOnInit() {    
    this.pager.showFirstLastButtons = true;    
    this.getData(1);
        
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  pageClick(event){
    this.getData(event.pageIndex);
  }

  addLivestock(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['master/livestock']);
  }

  edit(value: any) {
    this.routing.navigate(['master/livestock/'+value.livestockTypeId]);
  }
  
  delete(value: any) {
    if(confirm("Apakah Anda yakin akan menghapus baris ini?")){
      this.isLoading=true;
      this.livestockService.deleteLivestock(value.livestockTypeId).subscribe(
        data => {
          alert('Data berhasil dihapus!');
          this.cari();
        },
        error => {
          alert(error);
        },
        () => {
          this.isLoading=false;
        }
      )
    }
  }

  getData(page: number) {    
    this.isLoading=true;
    this.livestockService.selectLivestock(this.searchValue, page).subscribe(
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

  cari() {
    this.pager.pageIndex = 1;
    this.getData(this.pager.pageIndex);
  }
}
