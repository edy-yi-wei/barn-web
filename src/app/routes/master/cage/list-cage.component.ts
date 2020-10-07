import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { CageService } from '@shared/services/cage.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'cage-list',
  templateUrl: './list-cage.component.html',
  styleUrls: ['./cage.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListCageComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  list = [];  
  isLoading = true; 
  dragging = false;
  columns: string[] = ['tag', 'region', 'farm', 'unit', 'size', 'livestockType', 'notes', 'action'];

  searchValue = {
    search: ''    
  };

  constructor(
    private cageService: CageService,    
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

  addCage(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['master/cage']);
  }

  edit(value: any) {
    this.routing.navigate(['master/cage/'+value.cageId]);
  }
  
  delete(value: any) {
    if(confirm("Apakah Anda yakin akan menghapus baris ini?")){
      this.isLoading=true;
      this.cageService.deleteCage(value.cageId).subscribe(
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
    this.cageService.selectCages(this.searchValue, page).subscribe(
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
