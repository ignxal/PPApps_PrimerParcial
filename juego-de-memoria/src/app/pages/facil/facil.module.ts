import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilPageRoutingModule } from './facil-routing.module';

import { TimerModule } from 'src/app/components/timer/timer.module';
import { FacilPage } from './facil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilPageRoutingModule,
    TimerModule
  ],
  declarations: [FacilPage]
})
export class FacilPageModule {}
