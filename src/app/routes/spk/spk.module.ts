import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SpkRoutingModule } from './spk-routing.module';

import { ListContractorComponent } from './contractor/list-contractor.component';
import { ListSpkComponent } from './spk-document/list-spk.component';
import { ChooseContractorDialogComponent } from './spk-document/choose-contractor.component';
import { ContractorComponent } from './contractor/contractor.component';

const COMPONENTS = [ListContractorComponent, ListSpkComponent, ContractorComponent,
  ChooseContractorDialogComponent];
  
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, SpkRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SpkModule {}
