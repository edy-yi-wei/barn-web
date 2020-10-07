import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '@shared/services/user.service';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'user-list',
  templateUrl: './list-user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListUserComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  list = [];  
  isLoading = true; 
  dragging = false;
  columns: string[] = ['name', 'role', 'action'];

  searchValue = {
    search: ''    
  };

  constructor(
    private userService: UserService,
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

  addUser(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['master/user']);
  }

  edit(value: any) {
    this.routing.navigate(['master/user/'+value.userId]);
  }
  
  delete(value: any) {
    if(confirm("Apakah Anda yakin akan menghapus baris ini?")){
      this.isLoading=true;
      this.userService.deleteUser(value.userId).subscribe(
        data => {
          alert('Data berhasil dihapus!');
          // this.getData(this.pager.pageIndex);
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
    this.userService.selectUser(this.searchValue, page).subscribe(
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
