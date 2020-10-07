import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth-guard';
import { InboxComponent } from './inbox.component';
import { OutboxComponent } from './outbox.component';

const routes: Routes = [
  { 
    path: 'inbox', 
    component: InboxComponent, 
    canActivate: [AuthGuard],
    data: { title: 'Inbox' } 
  },
  { 
    path: 'outbox', 
    component: OutboxComponent, 
    canActivate: [AuthGuard],
    data: { title: 'Outbox' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
