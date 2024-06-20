import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisFotosPageRoutingModule } from './mis-fotos-routing.module';

import { CosasFeasPageModule } from '../cosas-feas/cosas-feas.module';
import { CosasLindasPageModule } from '../cosas-lindas/cosas-lindas.module';
import { MisFotosPage } from './mis-fotos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisFotosPageRoutingModule,
    CosasLindasPageModule,
    CosasFeasPageModule
  ],
  declarations: [MisFotosPage]
})
export class MisFotosPageModule {}
