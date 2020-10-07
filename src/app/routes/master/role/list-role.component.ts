import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { RoleService } from '@shared/services/role.service';

@Component({
  selector: 'role-list',
  templateUrl: './list-role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListRoleComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) pager: MatPaginator;

  list = [];  
  isLoading = true; 
  dragging = false;
  columns: string[] = ['name', 'notes', 'action'];

  searchValue = {
    search: ''    
  };

  constructor(
    private roleService: RoleService,
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

  addRole(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.routing.navigate(['master/role']);
  }

  edit(value: any) {
    this.routing.navigate(['master/role/'+value.roleId]);
  }
  
  delete(value: any) {
    if(confirm("Apakah Anda yakin akan menghapus baris ini?")){
      this.isLoading=true;
      this.roleService.deleteRole(value.roleId).subscribe(
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
    this.roleService.selectRole(this.searchValue, page).subscribe(
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
