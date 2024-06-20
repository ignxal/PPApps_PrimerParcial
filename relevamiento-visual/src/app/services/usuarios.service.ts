import { Injectable } from '@angular/core';
import { CollectionsService } from './collections.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../classes/user/customer';
import { Person } from '../classes/user/person';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private collectionName: string = "Usuarios";
  constructor(private collections: CollectionsService) { }

  private showUser = new BehaviorSubject(new Person());
  public currentUserState = this.showUser.asObservable();
  updateUserState(person: Person) {
    this.showUser.next(person)
  }

  getUsuarios() {
    return this.collections.getAll(this.collectionName);
  }

  getUsuario(id: string) {
    return this.collections.getOne(this.collectionName, id);
  }

  async addUsuario(person: Person) {
    return this.collections.exists(this.collectionName, "email", person.email).then(res => {
      if (res) {
        throw new Error("El usuario ya existe");
      } else {
        return this.collections.addOne(this.collectionName, person);
      }
    })
  }

  updateUsuario(person: Person) {
    return this.collections.update(this.collectionName, person);
  }

  async deleteUsuario(id: string) {
    return this.collections.delete(this.collectionName, id);
  }

  //Obtiene un observable con la colección
  getUsuariosSnapshot(){
    return this.collections.getAllSnapshot(this.collectionName) as Observable<Customer[]>;
  }



  findUsuario(mail: string){
    return this.collections.getOneByValue(this.collectionName, "email", mail);
  }

}
