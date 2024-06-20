import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';


export const loginGuard: CanActivateFn = (route, state) => {

  console.log('loginGuard', inject(AuthFirebaseService).isLoggedIn());

  if (inject(AuthFirebaseService).isLoggedIn()) {
    console.log('loginguard->',true)
    inject(AuthFirebaseService).updateLogoutState(true);
    return inject(Router).navigateByUrl('home');
  }
  else {
    console.log('loginguard->',false)
    inject(AuthFirebaseService).updateLogoutState(false);
    return true;
  }
}    
