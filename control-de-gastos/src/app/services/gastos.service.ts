import { Injectable } from '@angular/core';
import { and, where } from '@angular/fire/firestore';
import { Gastos } from '../classes/gastos';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  collectionName='gastos'
  constructor(private collections:CollectionsService) { }


  add(gastos:Gastos){
    return this.collections.addOne(this.collectionName,gastos)
  }

  update(gasto:Gastos){
    this.collections.update(this.collectionName,gasto)
  }

  get(email:string){
    let querys=[where('email','==',email)]
    return this.collections.getAllWhereSnapshot<Gastos>(this.collectionName,and(...querys))
  }
}
