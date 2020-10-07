import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'group-category-dialog',
  templateUrl: './group-category-dialog.component.html',
  styleUrls: ['./group-category.component.scss']  
})

export class GroupCategoryDialogComponent {
  groupName = new FormControl('');

  constructor(private dialogRef: MatDialogRef<GroupCategoryDialogComponent>) { }
  
  save(){
    this.dialogRef.close(this.groupName.value);
  }

  cancel() {
    this.dialogRef.close("");
  }
}
