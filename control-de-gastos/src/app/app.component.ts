import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthFirebaseService } from './services/authFirebase.service';
import { InterceptorService } from './services/interceptor.service';
import { QrService } from './services/qr.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public showOverlay = false;
  public showLoading = false;
  public showLogout = true;
  public showQr = false;
  public platformWin32 = false;
  public showModalQr = false;

  constructor(private platform: Platform, private router: Router, private interceptor: InterceptorService, private qr: QrService, private auth: AuthFirebaseService, private toast: ToastService) {

    interceptor.currentOverlayState.subscribe(data => this.showOverlay = data);
    interceptor.currentLoadingState.subscribe(data => this.showLoading = data);

    auth.currentLogoutState.subscribe((state) => {
      this.showLogout = state
      console.log("showLogout -> ", this.showLogout);
    });
    this.initializeApp();
  }

  async initializeApp() {
    if (!this.auth.userLogged) {
      this.platform.ready().then(async () => {
        this.router.navigateByUrl('splash-screen');
      });
    }
  }

  userLogout() {
    this.qr.onMostrarEscanearQr.emit(false);

    // this.interceptor.updateOverlayState(true);
    this.auth.logout().then(() => {
      let sVol = localStorage.getItem('volume') as string;
      if(sVol != 'false') 
        // NativeAudio.play({ assetId: 'close' });    

      this.router.navigateByUrl('/login');      
      
    })
  }
}
