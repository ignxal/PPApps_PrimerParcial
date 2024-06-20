import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosasFeasPageRoutingModule } from './cosas-feas-routing.module';

import { GBarraComponent } from '../g-barra/g-barra.component';
import { CosasFeasPage } from './cosas-feas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosasFeasPageRoutingModule,
    
  ],
  declarations: [CosasFeasPage,GBarraComponent]
})
export class CosasFeasPageModule {}
