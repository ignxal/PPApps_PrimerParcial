import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosasLindasPageRoutingModule } from './cosas-lindas-routing.module';

import { GTortaComponent } from '../g-torta/g-torta.component';
import { CosasLindasPage } from './cosas-lindas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosasLindasPageRoutingModule
  ],
  declarations: [CosasLindasPage,GTortaComponent] 
})
export class CosasLindasPageModule {}
