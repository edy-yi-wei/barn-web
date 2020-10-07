import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Router } from '@angular/router';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialService } from '@shared/services/material.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { GroupCategoryService } from '@shared/services/groupCategory.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GroupCategoryDialogComponent } from './group-category-dialog.component';

interface GroupCategoryNode {
  id?: number;
  name: string;
  groupName?: string;
  children?: GroupCategoryNode[];
}

const TREE_DATA: GroupCategoryNode[] = [
  // {
  //   name: 'Fruit',
  //   children: [
  //     {name: 'Apple'},
  //     {name: 'Banana'},
  //     {name: 'Fruit loops'},
  //   ]
  // }, {
  //   name: 'Vegetables',
  //   children: [
  //     {
  //       name: 'Green',
  //       children: [
  //         {name: 'Broccoli'},
  //         {name: 'Brussels sprouts'},
  //       ]
  //     }, {
  //       name: 'Orange',
  //       children: [
  //         {name: 'Pumpkins'},
  //         {name: 'Carrots'},
  //       ]
  //     },
  //   ]
  // },
];

@Component({
  selector: 'group-category-list',
  templateUrl: './list-group-category.component.html',
  styleUrls: ['./group-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ListGroupCategoryComponent implements OnInit{
  treeControl = new NestedTreeControl<GroupCategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<GroupCategoryNode>();
  isLoading = true;   
  
  constructor(private service: GroupCategoryService, private dialog: MatDialog) {
    // this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    console.log(TREE_DATA);
    this.getData();
  }

  getData() {
    this.isLoading=true;
    this.service.selectAllGroupCategory(1).subscribe(
      data => {
        // console.log(data);
        data.forEach(element => {
          var nilai = {
            id: element.groupCategoryId,
            name: element.groupCategoryName,
            groupName: element.groupName,
            children: this.fetchChildren(element.children)
          }
          TREE_DATA.push(nilai);
        });
        this.dataSource.data = TREE_DATA;
        console.log(TREE_DATA);
      },
      error => {
        console.log(error)
      },
      () => {
        this.isLoading=false
      }
    );
  }

  fetchChildren(list: any[]){
    var daftar = [];
    if(list!=null){
      list.forEach(element => {
        var nilai = {
          id: element.groupCategoryId,
          name: element.groupCategoryName,
          groupName: element.groupName,
          children: this.fetchChildren(element.children)
        }
        daftar.push(nilai);
      });
    }
    return daftar;
  }

  hasChild = (_: number, node: GroupCategoryNode) => !!node.children && node.children.length > 0;
  
  add(node){
    var hasil = this.dialog.open(GroupCategoryDialogComponent);
    hasil.afterClosed().subscribe(data => {
      console.log(data)
      if(data!=''){
        this.service.addGroupCategory(node.id, data).subscribe(
          data => {
            console.log(data);
            alert(data);
          },
          error => {
            console.log(error)
          },
          () => {
            this.isLoading=false
          }
        );
      }
    });
  }

  edit(node){
    console.log(node);
  }

  delete(node){
    console.log(node);
  }
}
