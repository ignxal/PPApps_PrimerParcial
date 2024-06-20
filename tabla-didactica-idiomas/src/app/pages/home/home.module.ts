import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { AnimalesComponent } from 'src/app/components/animales/animales.component';
import { ColoresComponent } from 'src/app/components/colores/colores.component';
import { NumerosComponent } from 'src/app/components/numeros/numeros.component';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,

  ],
  declarations: [HomePage, AnimalesComponent,
    NumerosComponent,
    ColoresComponent]
})
export class HomePageModule { }
