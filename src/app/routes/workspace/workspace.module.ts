import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { InboxComponent } from './inbox.component';
import { WorkspaceDetailDialogComponent } from './workspace-detail.component';
import { WorkspaceApprovalDialogComponent } from './workspace-approval.component';
import { OutboxComponent } from './outbox.component';

const COMPONENTS = [InboxComponent, OutboxComponent, WorkspaceDetailDialogComponent, WorkspaceApprovalDialogComponent];
  
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, WorkspaceRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class WorkspaceModule {}
