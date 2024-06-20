import { EventEmitter, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FotosService } from './fotos.service';
// import { SolicitarMesaModalComponent } from '../Components/solicitar-mesa-modal/solicitar-mesa-modal.component';
import { Router } from '@angular/router';

import { AuthFirebaseService } from './authFirebase.service';
import { InterceptorService } from './interceptor.service';
import { ToastService } from './toast.service';

export enum tipoQr {
  Producto = "PP@",
  Ingreso = "II@",
  EncuestasAnt = "EA@",
  EncuestasSat = "ES@",
  Encuesta = "EE@",
  //MesaDisponibilidad = "MD@",
  Mesa = "ME@",
  //MesaConsulta = "MC@",
  Menu = "MM@",
  //PedidoEstado = "PE@",
  Juegos = "JJ@",
  Propina = "PR@",
}

@Injectable({
  providedIn: 'root'
})

export class QrService {

  onMostrarEscanearQr: EventEmitter<boolean> = new EventEmitter();
  onMostrarModal: EventEmitter<string> = new EventEmitter();
  
  onConsultarEstado: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private auth: AuthFirebaseService,
    private router: Router,
    private fotos: FotosService,
    private modalController: ModalController,
   
    private toast: ToastService,
   
    private interceptor: InterceptorService,
    private modal: ModalController,
  ) { }

  mostrarEscanearQr(mostrar: boolean) {
    this.onMostrarEscanearQr.emit(mostrar);
  }

  generarTexto(tipo: tipoQr, objeto: any) {
    switch (tipo) {
      case tipoQr.Producto:
        return tipoQr.Producto + objeto.id;
      case tipoQr.Ingreso:
        return tipoQr.Ingreso + "PERTUTTOIngreso";

      case tipoQr.EncuestasAnt:
        return tipoQr.EncuestasAnt + "PERTUTTOEncuestasAntiguas";
      case tipoQr.EncuestasSat:
        return tipoQr.EncuestasSat + objeto.id;

      case tipoQr.Mesa:
        return tipoQr.Mesa + objeto.numero;
      case tipoQr.Menu:
        return tipoQr.Menu + "PERTUTTOMenu";

      case tipoQr.Juegos:
        return tipoQr.Juegos + objeto.id;
      case tipoQr.Propina:
        return tipoQr.Propina + "PERTUTTOPropina";

      default:
        return "";
    }
  }

  generarQr(objeto: any, tipo: tipoQr) {
    let qr = this.generarTexto(tipo, objeto);

    return qr
  }

  //Aca se debe generar el routeo segun tipo
  leerQr(url: string = "") {
    if (url == "")
      this.fotos.scan()
        .then((qr) => {
          if (qr.charAt(2) == '@') {
            let tipo = qr.substring(0, 3);
            let id = qr.substring(3);

            this.buscarAccion(tipo, id)
          }
          else if (qr.startsWith("@")) {
            this.leerDNIOld(qr);
          }
          else {
            this.leerDNINew(qr);
          }
        })
    else {
      let tipo = url.substring(0, 3);
      let id = url.substring(3);

      console.log('tipo', tipo);
      console.log('id', id);

      this.buscarAccion(tipo, id)

    }
  }

  buscarAccion(tipo: string, id: string) {
    switch (tipo) {
      case tipoQr.Producto:
        tipo = tipoQr.Producto;
        break;
      case tipoQr.Ingreso:
        
        break;
      case tipoQr.EncuestasAnt:
        this.router.navigateByUrl('/encuestas/graficos')
        break;
      case tipoQr.EncuestasSat:
        this.router.navigateByUrl('/encuestas/cliente')
        break;
      case tipoQr.Mesa:
        
        break;
      case tipoQr.Menu:
        tipo = tipoQr.Menu;
        break;
      case tipoQr.Propina:
        
        break;
    }
  }

  leerDNINew(qr: string) {
    if (qr != "") {
      let infoDNI: string[] = qr.split("@");
      let dni = parseInt(infoDNI[4]);
      let apellido = infoDNI[1];
      let nombres = infoDNI[2];
      // let person = new Person("", nombres, apellido, dni, "", "", Profiles.Cliente);
      // this.usuariosService.updateUserState(person);
    }
  }

  leerDNIOld(qr: string) {
    if (qr != "") {
      let infoDNI: string[] = qr.split("@");
      let dni = parseInt(infoDNI[1]);
      let apellido = infoDNI[4];
      let nombres = infoDNI[5];
      // let person = new Person("", nombres, apellido, dni, "", "", Profiles.Cliente);
      // this.usuariosService.updateUserState(person);
    }
  }

  //Todo Controlar tambien sobre el perfil del usuario
  
  // async openModalEstado(pedido: Pedido) {
  //   // Creating the result modal
  //   const modal = await this.modal.create({
  //     component: PedidoEstadoModalComponent,
  //     componentProps: {
  //       pedido: pedido,
  //     },
  //     cssClass: 'block',
  //     initialBreakpoint: 0.25,
  //     breakpoints: [0, 0.25],
  //   });

  //   // Registering back to menu event after dismiss
  //   // modal.onDidDismiss().then(_ => this.router.navigate(['/menu']));

  //   // Showing modal
  //   return await modal.present();
  // }


}
