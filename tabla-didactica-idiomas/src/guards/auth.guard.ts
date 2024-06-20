import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';


export const authGuard: CanActivateFn = (route, state) => {  
  
    console.log('authGuard', inject(AuthFirebaseService).isLoggedIn());
  
    if(inject(AuthFirebaseService).isLoggedIn()) {
      inject(AuthFirebaseService).updateLogoutState(true);
      return true;
    }
    else {
      inject(AuthFirebaseService).updateLogoutState(false);
      return inject(Router).navigateByUrl('login');
    }
  }    
