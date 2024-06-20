import { Injectable, EventEmitter } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedUser!: undefined;
  onUserLogged: EventEmitter<any> = new EventEmitter<any>();
  onUserLogout: EventEmitter<void> = new EventEmitter<void>();
  constructor(private auth: Auth) {}

  async loginUser(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.setUserToStorage();
      return { result: true, error: false };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          return {
            result: false,
            error: 'Correo electrónico o contraseña incorrecta',
          };
        default:
          return { result: false, error: 'Error al iniciar sesion' };
      }
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
      this.loggedUser = undefined;
      this.deleteUserFromStorage();
      return { result: true, error: '' };
    } catch (error) {
      return { result: false, error: 'Error al cerrar sesion' };
    }
  }

  setUserToStorage(flag: boolean = false) {
    localStorage.setItem('currentUser', JSON.stringify(this.loggedUser));
    if (!flag) {
      this.onUserLogged.emit(this.loggedUser);
    }
  }

  getUserFromStorage() {
    if (this.loggedUser === undefined) {
      try {
        const user = JSON.parse(
          localStorage.getItem('currentUser') || undefined!
        );
        if (user) {
          this.loggedUser = user;
          this.onUserLogged.emit(this.loggedUser);
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    } else {
      this.onUserLogged.emit(this.loggedUser);
    }
  }

  deleteUserFromStorage() {
    localStorage.removeItem('currentUser');
    this.onUserLogout.emit();
  }
}
