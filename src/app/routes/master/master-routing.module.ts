import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth-guard';
import { ListCageComponent } from './cage/list-cage.component';
import { CageComponent } from './cage/cage.component';
import { MaterialComponent } from './material/material.component';
import { ListMaterialComponent } from './material/list-material.component';
import { ListLivestockComponent } from './livestock/list-livestock.component';
import { LivestockComponent } from './livestock/livestock.component';
import { ListUserComponent } from './user/list-user.component';
import { UserComponent } from './user/user.component';
import { ListRoleComponent } from './role/list-role.component';
import { RoleComponent } from './role/role.component';
import { ListGroupCategoryComponent } from './group-category/list-group-category.component';

const routes: Routes = [
  { 
    path: 'cage-list', 
    component: ListCageComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Kandang' } 
  },
  {
    path: 'cage/:id',
    component: CageComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'cage',
    component: CageComponent,
    // canActivate: [AuthGuard]
  },
  { 
    path: 'material-list', 
    component: ListMaterialComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Material' } 
  },
  {
    path: 'material/:id',
    component: MaterialComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'material',
    component: MaterialComponent,
    // canActivate: [AuthGuard]
  },
  { 
    path: 'livestock-list', 
    component: ListLivestockComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Jenis Ternak' } 
  },
  {
    path: 'livestock/:id',
    component: LivestockComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'livestock',
    component: LivestockComponent,
    // canActivate: [AuthGuard]
  },
  { 
    path: 'group-category-list', 
    component: ListGroupCategoryComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Group' } 
  },  
  { 
    path: 'user-list', 
    component: ListUserComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'User' } 
  },
  {
    path: 'user/:id',
    component: UserComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserComponent,
    // canActivate: [AuthGuard]
  },
  { 
    path: 'role-list', 
    component: ListRoleComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Role' } 
  },
  {
    path: 'role/:id',
    component: RoleComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'role',
    component: RoleComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
