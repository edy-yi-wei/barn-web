import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListContractorComponent } from './contractor/list-contractor.component';
import { AuthGuard } from 'app/auth-guard';
import { ContractorComponent } from './contractor/contractor.component';
import { ListSpkComponent } from './spk-document/list-spk.component';
import { SpkComponent } from './spk-document/spk.component';

const routes: Routes = [
  { 
    path: 'spk-contractor-list', 
    component: ListContractorComponent, 
    // canActivate: [AuthGuard],
    data: { title: 'Kontraktor' } 
  },
  {
    path: 'spk-contractor/:id',
    component: ContractorComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'spk-contractor',
    component: ContractorComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'spk-document-list',
    component: ListSpkComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'spk-document/:id',
    component: SpkComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'spk-document',
    component: SpkComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpkRoutingModule {}
