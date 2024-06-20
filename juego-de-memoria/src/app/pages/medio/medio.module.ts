import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedioPageRoutingModule } from './medio-routing.module';

import { TimerModule } from 'src/app/components/timer/timer.module';
import { MedioPage } from './medio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedioPageRoutingModule,
    TimerModule
  ],
  declarations: [MedioPage]
})
export class MedioPageModule {}
