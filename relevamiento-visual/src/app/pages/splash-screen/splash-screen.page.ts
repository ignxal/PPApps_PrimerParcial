import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {
  names: string[] = ['Ignacio Logiudice'];
  listNames: string[] = ['Ignacio', 'Logiudice'];

  constructor(private router: Router) {}

  ngOnInit() {
    //NativeAudio.preload({
    //  assetId: 'entrance',
    //  assetPath: 'entrance.mp3',
    //  audioChannelNum: 1,
    //  isUrl: false,
    //}).then(() => {
    //  let sVol = localStorage.getItem('volume') as string;
    //  if (sVol != 'false') {
    //    NativeAudio.play({ assetId: 'entrance' });
    //  }
    //});
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 5000);
  }

  showNames() {
    setTimeout(() => {
      this.names.forEach((name, index) => {
        setTimeout(() => {
          this.listNames.push(name);
        }, index * 1000);
      });
    }, 1000);
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
