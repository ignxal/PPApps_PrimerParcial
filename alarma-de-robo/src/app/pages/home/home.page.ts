import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { IonModal } from '@ionic/angular';
import { Person } from 'src/app/classes/user/person';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
//import { DeviceMotion } from '@capacitor/device-motion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario!: Person;
  alarmaActivada: boolean = false;
  alarmaGeneralAudio!: HTMLAudioElement;
  alarmaIzquierdaAudio!: HTMLAudioElement;
  alarmaDerechaAudio!: HTMLAudioElement;
  alarmaVerticalAudio!: HTMLAudioElement;
  alarmaHorizontalAudio!: HTMLAudioElement;
  activarAlarmaAudio!: HTMLAudioElement;

  constructor(private auth: AuthFirebaseService, private router: Router) {}

  motionListener?: PluginListenerHandle;
  password: string = '';
  error: string = '';
  texto: string = 'ALARMA DESACTIVADA';
  collapse: boolean = true;

  horizontalActivada: boolean = false;
  verLogout: boolean = true;

  @ViewChild('openModalButton', { read: ElementRef })
  openModalButton!: ElementRef;
  @ViewChild('modal') modal!: IonModal;

  ngOnInit(): void {
    localStorage.setItem('alarma', 'inactiva');
    this.alarmaActivada = false;
    console.log(localStorage.getItem('alarma') == 'activa');
    this.loadAllAudio();
    this.usuario = this.auth.userLogged;
  }

  async loadAllAudio() {
    this.alarmaGeneralAudio = await this.loadAudio(
      'homero-no te robes mi cerveza.mp3'
    );
    this.alarmaIzquierdaAudio = await this.loadAudio(
      'alarma-para-despertar-3.mp3'
    );
    this.alarmaDerechaAudio = await this.loadAudio('red-alert.mp3');
    this.alarmaVerticalAudio = await this.loadAudio(
      'alarma-de-evacuacin-evacuacion.mp3'
    );
    this.activarAlarmaAudio = await this.loadAudio('trabar-alarma.mp3');
    this.alarmaHorizontalAudio = await this.loadAudio(
      'loud-alarm-ringtones-annoying.mp3'
    );
  }
  async reproducirAudio(audio: HTMLAudioElement) {
    try {
      if (!audio.paused) {
        console.log('Audio ya en reproduccion');
        return;
      }

      await audio.play();
      console.log('Audio en reproducción');

      setTimeout(() => {
        this.stopAudio(audio);
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  }

  /*async solicitarPermisosSensor() {
    try {
      const result = await DeviceMotion.requestPermissions();
      if (result.granted) {
        console.log('Permisos para el sensor de orientación concedidos');
        // Puedes iniciar el sensor aquí después de que se concedan los permisos
      } else {
        console.warn(
          'Permisos para el sensor de orientación no fueron concedidos'
        );
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }*/

  stopAudio(audio: HTMLAudioElement) {
    audio.pause();
    audio.currentTime = 0;
  }

  async loadAudio(filename: string): Promise<HTMLAudioElement> {
    const assetCompleto = `assets/audio/${filename}`;
    console.log('Cargando', assetCompleto);

    try {
      const audio = await new Promise<HTMLAudioElement>((resolve, reject) => {
        const audioElement = new Audio(assetCompleto);
        audioElement.addEventListener('canplaythrough', () =>
          resolve(audioElement)
        );
        audioElement.onerror = () =>
          reject(new Error(`Error: ${assetCompleto}`));
      });
      return audio;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  openModal() {
    this.modal.present();
  }

  activarAlarma() {
    this.verLogout = false;
    this.collapse = true;
    this.alarmaActivada = true;
    localStorage.setItem('alarma', 'activa');
    console.log('Alarma activada');
    this.iniciarSensor();
    this.reproducirAudio(this.activarAlarmaAudio);
  }

  desactivarAlarma() {
    if (
      this.password.toString() == JSON.parse(localStorage.getItem('password'))!
    ) {
      this.alarmaActivada = false;
      this.collapse = true;
      this.verLogout = true;
      this.horizontalActivada = false;
      localStorage.setItem('alarma', 'inactiva');
      this.detenerSensor();
      this.modal.dismiss();
    } else {
      this.alarmaGeneral();
    }
    this.password = '';
  }

  betaInicial = 0;
  gamaInicial = 0;
  alphaInicial = 0;
  betaActual = 0;
  gamaActual = 0;
  alphaActual = 0;

  betaAnterior = 0;
  gamaAnterior = 0;

  volvio = true;
  levanto = true;
  indiceActual = 0;
  ultimoCambio = new Date().getTime();

  async iniciarSensor() {
    console.log('Iniciando sensor');
    try {
      /* TEST AUDIO
      setTimeout(async () => {
        await this.alarmaIzquierda();
        setTimeout(async () => {
          await this.alarmaDerecha();
          setTimeout(async () => {
            await this.alarmaVertical();
            setTimeout(async () => {
              await this.alarmaHorizontal();
              setTimeout(async () => {
                await this.alarmaDerecha();
              }, 10000);
            }, 11000);
          }, 7000);
        }, 6000);
      }, 2500);*/
      // Comienza a escuchar los eventos del acelerómetro
      this.motionListener = await Motion.addListener(
        'orientation',
        async (data: any) => {
          if (this.betaInicial === 0) {
            this.betaInicial = data.beta;
            this.gamaInicial = data.gamma;
            this.alphaInicial = data.alpha;
          }
          console.log(data);
          // const rotationAlpha = data.alpha;
          const rotationBeta = data.beta;
          const rotationGamma = data.gamma;

          let ahora = new Date().getTime();
          // const rotationAlpha = data.alpha;

          this.ultimoCambio = ahora;
          if (this.alarmaActivada) {
            if (rotationGamma < -50) {
              await this.alarmaIzquierda();
              this.volvio = false;
            } else if (rotationGamma > 50) {
              await this.alarmaDerecha();
              this.volvio = false;
            } else if (rotationGamma > -10 && rotationGamma < 10) {
              console.log('volvio');
              this.volvio = true;
            } else if (
              rotationGamma > -10 &&
              rotationGamma < 10 &&
              this.horizontalActivada
            ) {
              await this.alarmaHorizontal();
              this.alarmaActivada = true;
            } else {
              await this.alarmaVertical();
            }
          }
        }
      );
    } catch (error) {
      console.error('Error al iniciar el sensor:', error);
    }
  }

  detenerSensor() {
    // Detén la escucha del acelerómetro cuando el componente se destruye
    this.motionListener?.remove();
  }

  async alarmaGeneral() {
    this.vibrar(5000);
    await this.reproducirAudio(this.alarmaGeneralAudio);
    CapacitorFlash.switchOn({ intensity: 1 }).then(() => {
      setTimeout(() => {
        CapacitorFlash.switchOff();
      }, 5000);
    });
    this.horizontalActivada = true;
  }

  async vibrar(milisec: number) {
    try {
      await Haptics.vibrate({ duration: milisec });
    } catch (error) {
      console.error('Error al activar la vibración:', error);
    }
  }

  async alarmaIzquierda() {
    await this.reproducirAudio(this.alarmaIzquierdaAudio);
  }

  async alarmaDerecha() {
    await this.reproducirAudio(this.alarmaDerechaAudio);
  }

  async alarmaVertical() {
    CapacitorFlash.switchOn({ intensity: 1 }).then(() => {
      setTimeout(() => {
        CapacitorFlash.switchOff();
      }, 5000);
    });
    await this.reproducirAudio(this.alarmaVerticalAudio);
  }

  async alarmaHorizontal() {
    this.vibrar(5000);
    await this.reproducirAudio(this.alarmaHorizontalAudio);
  }
}
