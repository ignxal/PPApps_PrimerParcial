import { Injectable } from '@angular/core';
import { OrderByDirection, QueryFilterConstraint, and, where } from '@angular/fire/firestore';
import {
  BarcodeScanner
} from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Foto } from '../classes/foto';
import { Voto } from '../classes/votos';
import { TipoCosa } from '../enums/tipoCosa';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  collectionName:string = 'fotos'
  isSupported: boolean = false;
  //storage:FirebaseStorage;
  constructor(private alertController: AlertController,private collections:CollectionsService) {

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.installGoogleBarcodeScannerModule();

  }

  async takePhoto() {
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    })
  }

  uploadFoto(foto:Foto){
    this.collections.addOne(this.collectionName,foto)
    .then(data=>{
      return data
    })    
  }

  deleteVoto(foto:Foto,email:string){
    foto.votos.forEach(element => {
      if(element.email == email){
        foto.votos.splice(foto.votos.indexOf(element),1)
      }})
      this.collections.update(this.collectionName,foto)
  }

  revertirVoto(foto:Foto,email:string){
    foto.votos.forEach(element => {
      if(element.email == email){
        element.tipo  = element.tipo == 'up'? 'down' : 'up';
      }})
      this.collections.update(this.collectionName,foto)
  }

  addVoto(foto:Foto,email:string,tipo:'up'|'down'){

    let voto:Voto = {email,tipo}
    foto.votos.push(voto);
      this.collections.update(this.collectionName,foto)
  }

  getFotos(tipo:TipoCosa){
    let query: QueryFilterConstraint[] = [];
    let by: OrderByDirection = 'desc'


    query.push(where('cosa', '==', tipo));    

    return this.collections.getAllWhereSnapshot<Foto>(this.collectionName,and(...query),'fecha',by)
  }

  getAll(){   

    return this.collections.getAllSnapshot<Foto>(this.collectionName)
  }



  startScan() {
    this.scan().then((scanned: string) => {
      return
    }).catch(error => {
      setTimeout(() => {
        this.test("¡Hubo un error al leer el código!");
      }, 3000);

    });

  }

  async scan(): Promise<string> {
    var scanned = false;
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return "";
    }
    const { barcodes } = await BarcodeScanner.scan();

    for (let index = 0; index < barcodes.length; index++) {
      const element = barcodes[index];
    }

    return barcodes[0].rawValue;
  }


  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async test(barcode: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Bueno',
      message: barcode,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
