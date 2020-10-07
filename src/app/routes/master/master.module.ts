import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MasterRoutingModule } from './master-routing.module';

import { ListCageComponent } from './cage/list-cage.component';
import { CageComponent } from './cage/cage.component';
import { ListMaterialComponent } from './material/list-material.component';
import { MaterialComponent } from './material/material.component';
import { ListLivestockComponent } from './livestock/list-livestock.component';
import { LivestockComponent } from './livestock/livestock.component';
import { ListUserComponent } from './user/list-user.component';
import { UserComponent } from './user/user.component';
import { ListRoleComponent } from './role/list-role.component';
import { RoleComponent } from './role/role.component';
import { ListGroupCategoryComponent } from './group-category/list-group-category.component';
import { GroupCategoryDialogComponent } from './group-category/group-category-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

const COMPONENTS = [ListCageComponent, CageComponent, ListMaterialComponent, MaterialComponent, 
  ListLivestockComponent, LivestockComponent, ListUserComponent, UserComponent, ListRoleComponent, 
  RoleComponent, ListGroupCategoryComponent, GroupCategoryDialogComponent];
  
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, MasterRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class MasterModule {}
