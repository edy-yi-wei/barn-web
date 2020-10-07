import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { MaterialExtensionsModule } from '@ng-matero/extensions';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ToastrModule } from 'ngx-toastr';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { NumberFormatterDirective } from './directives/number-formatter.directive';
import { SpkComponent } from 'app/routes/spk/spk-document/spk.component';
import { PurchaseRequestComponent } from 'app/routes/spk/spk-document/purchase-request.component';
import { ChoosePrDialogComponent } from 'app/routes/spk/spk-document/choose-pr.component';
import { WorkVolumeComponent } from 'app/routes/spk/spk-document/work-volume.component';
import { WorkDetailComponent } from 'app/routes/spk/spk-document/work-detail.component';
import { SpkAttachmentComponent } from 'app/routes/spk/spk-document/spk-attachment.component';
import { WorkVolumeExtendComponent } from 'app/routes/spk/spk-document/work-volume-extend.component';
import { LogComponent } from 'app/routes/spk/spk-document/log.component';
import { ApprovalComponent } from 'app/routes/spk/spk-document/approval.component';

const THIRD_MODULES = [
  MaterialModule,
  MaterialExtensionsModule,
  FlexLayoutModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgSelectModule,
  FormlyMaterialModule,
];
const COMPONENTS = [BreadcrumbComponent, PageHeaderComponent, ErrorCodeComponent, SpkComponent, PurchaseRequestComponent, ChoosePrDialogComponent, WorkVolumeComponent,
  WorkDetailComponent, SpkAttachmentComponent, WorkVolumeExtendComponent, LogComponent, ApprovalComponent];
const COMPONENTS_DYNAMIC = [];
const DIRECTIVES = [NumberFormatterDirective];
const PIPES = [];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    ToastrModule.forRoot(),
    ...THIRD_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule,
    ToastrModule,
    ...THIRD_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SharedModule {}
