import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Foto } from 'src/app/classes/foto';
import { TipoCosa } from 'src/app/enums/tipoCosa';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { FotosService } from 'src/app/services/fotos.service';
import { InterceptorService } from 'src/app/services/interceptor.service';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.page.html',
  styleUrls: ['./cosas-feas.page.scss'],
})
export class CosasFeasPage implements OnInit, OnDestroy {
  fotoSrc!: SafeUrl
  cosasSub!: Subscription

  cosas: Foto[] = []

  fotosUp: SafeUrl[] = []
  fotosUploadFinish: Foto[] = []

  constructor(private fotosService: FotosService, private sanitizer: DomSanitizer, private auth: AuthFirebaseService, private interceptor: InterceptorService) { }
  ngOnDestroy(): void {
    this.cosasSub?.unsubscribe();
  }

  loadImg(imagenRef: HTMLImageElement, event: any) {

    const img = imagenRef
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    var canvas = document.createElement('canvas');
    var MAX_WIDTH = 350;
    var MAX_HEIGHT = 250;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0, width, height);
    var result = canvas.toDataURL();


    let foto: Foto = new Foto('', TipoCosa.Fea, result, this.auth.userLogged.email, Timestamp.now())
    this.fotosUploadFinish.push(foto)
  }



  ngOnInit() {
    this.interceptor.updateOverlayState(true);
    this.cosasSub = this.fotosService.getFotos(TipoCosa.Fea).subscribe(fotos => {
      this.interceptor.updateOverlayState(false);
      this.cosas = fotos
    })

  }

  capturarFoto() {
    this.fotosService.takePhoto().then((photo) => {
      let data = "data:image/" + photo.format + ";base64,"
      this.fotosUp.push(this.sanitizer.bypassSecurityTrustUrl(`${data} ${photo.base64String}`));
      this.openModal()
    })
  }

  mostrarFecha(fecha: Timestamp) {

    return fecha.toDate().toLocaleString();
  }

  votar(foto: Foto, tipo: 'up' | 'down') {
    if (!this.getVoto(foto)) {
      this.fotosService.addVoto(foto, this.auth.userLogged.email, tipo)
    } else {
      if (!this.getVotoTipo(foto, tipo)) {
        this.fotosService.deleteVoto(foto, this.auth.userLogged.email)
      } else {
        this.fotosService.revertirVoto(foto, this.auth.userLogged.email)
      }
    }
  }

  votoArriba(foto: Foto) {
    this.votar(foto, 'up')
  }

  votoAbajo(foto: Foto) {
    this.votar(foto, 'down')
  }

  getVotoTipo(foto: Foto, tipo: 'up' | 'down') {
    return foto.votos.some(voto => voto.email == this.auth.userLogged.email && voto.tipo == tipo)
  }

  getVoto(foto: Foto) {
    return foto.votos.some(voto => voto.email == this.auth.userLogged.email)
  }

  getCantidadVotos(foto: Foto, tipo: 'up' | 'down') {
    return foto.votos.filter(voto => voto.tipo == tipo).length
  }

  @ViewChild('addPhotosModal') modal!: IonModal;
  openModal() {
    this.modal.present()
    this.modal.onDidDismiss().then(() => {this.fotosUploadFinish = []})
  }

  async subirFotos() {
    this.fotosUploadFinish.forEach(async foto => {
      await this.fotosService.uploadFoto(foto);
    })

    this.modal.dismiss()
  }

  delFoto(foto:Foto) {
    this.fotosUploadFinish = this.fotosUploadFinish.filter(f => f != foto)
  }

}
