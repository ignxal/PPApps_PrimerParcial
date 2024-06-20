import { Injectable } from '@angular/core';

import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

import { Person } from '../classes/user/person';
import { Profiles } from '../enums/profiles';
import { User } from '../interfaces/user';
import { CollectionsService } from './collections.service';
import { PushNotificationsService } from './push-notifications.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  app: any;
  db: any;
  userLogged!: Person;
  collectionName = "Usuarios";

  constructor(private auth: Auth, private toastService: ToastService, private collection: CollectionsService, private push: PushNotificationsService) {
    //Recuperar de localstorage
    if (localStorage.getItem('userLogged') != 'undefined')
      this.userLogged = JSON.parse(localStorage.getItem('userLogged') as string) as Person;
  }

  private showLogout = new BehaviorSubject(false);
  public currentLogoutState = this.showLogout.asObservable();
  updateLogoutState(state: boolean) {
    this.showLogout.next(state)
  }

  async login(user: User) {
    let userDos = user
    return signInWithEmailAndPassword(this.auth, user.email, user.pass)
      .then(async (userCredential) => {
        const userAuth = userCredential.user;
        console.log("Usuario logueado -> ", userAuth);

        await this.collection.getOne(this.collectionName, userAuth.uid)
          .then(user => {
            let users = user.docs.map(doc => doc.data() as Person)            
            this.userLogged = users[0];
            this.push.getToken().then((token) => { this.saveToken(token) })
            // console.log("Usuario firestoreado -> ", this.userLogged);

            //Guardar en localstorage
            localStorage.setItem('userLogged', JSON.stringify(this.userLogged));
            localStorage.setItem('password', JSON.stringify(userDos.pass));
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/user-not-found":
                this.toastService.openErrorToast("Usuario no encontrado")
                break;
              case "auth/wrong-password":
                this.toastService.openErrorToast("Contraseña incorrecta")
                break;
              case "auth/permission-denied":
                this.toastService.openErrorToast("Permiso denegado por Firebase")
                break;
            }

          });
      })
  }

  async addUser(user: Person, password: string): Promise<boolean> {
    const userAdd = await createUserWithEmailAndPassword(this.auth, user.email, password)
      .then(async (userCredential) => {
        console.log("registrado con exito ->", userCredential);
        user.id = userCredential.user.uid;
        this.collection.addOne(this.collectionName, user).then(e => {
          console.log("Usuario agregado ->", e);
        }).catch(e => {
          console.log("error ->", e);
        });

        return true;

      }).catch(async error => {
        console.log("error ->", error);
        return false;
      });

    return userAdd;
  }

  
  saveToken(token: string) {
    console.log(this.userLogged.token)
    this.userLogged.token = token;
    this.collection.addOne("Usuarios", this.userLogged);
  }
  
  async clearToken(user: Person) {
    this.userLogged.token = "";
    this.collection.addOne("Usuarios", user);
  }

  async logout() {
    const auth = getAuth();
    try {
      await signOut(auth);
      this.clearToken(this.userLogged);
      this.userLogged = undefined!
      localStorage.removeItem('userLogged');
    } catch (error) {
      console.log(error);
    }
  }

  isLoggedIn(): boolean {
    // if (this.userLogged == null)
    //   return false;

    const user = JSON.parse(localStorage.getItem('userLogged') as string);
    return user != null ? true : false;
  }

  getRole(): string {
    if (this.userLogged == null || this.userLogged.profile == Profiles.Anonimo)
      return "";

    const user = JSON.parse(localStorage.getItem('userLogged') as string);
    return user != null ? user.profile : "";
  }


}
