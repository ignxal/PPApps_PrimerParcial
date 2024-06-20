import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DificilPageRoutingModule } from './dificil-routing.module';

import { TimerModule } from 'src/app/components/timer/timer.module';
import { DificilPage } from './dificil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DificilPageRoutingModule,
    TimerModule
  ],
  declarations: [DificilPage]
})
export class DificilPageModule {}
