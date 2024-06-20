import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { IonModal } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';


import { Foto } from 'src/app/classes/foto';
import { TipoCosa } from 'src/app/enums/tipoCosa';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { FotosService } from 'src/app/services/fotos.service';

@Component({
  selector: 'app-g-torta',
  templateUrl: './g-torta.component.html',
  styleUrls: ['./g-torta.component.scss'],
})
export class GTortaComponent  implements OnInit,OnDestroy {

  public chart: any;
  fotos: Foto[] = [];
  fotosSub!:Subscription
  elementoSeleccionado!: Foto

  @ViewChild('openModalButton', { read: ElementRef }) openModalButton!: ElementRef;
  @ViewChild('modal') modal!: IonModal;

  constructor(private fotosService: FotosService,private auth:AuthFirebaseService) { }
  ngOnDestroy(): void {
    this.fotosSub?.unsubscribe();
  }

  
  ngOnInit() {
    this.traerObjetos();
  }
  
  traerObjetos() {
    this.fotosSub = this.fotosService.getFotos(TipoCosa.Linda).subscribe((informacion) => {
      this.fotos = informacion;
      this.createChart();
    });
    
  }

  mostrarFecha(fecha: Timestamp) {
    return fecha.toDate().toLocaleString();
  }

  

  createChart() {

    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico anterior si existe
    }

    let labels: Array<string> = [];
    let data: Array<number> = []; // Cambiado a Array<number> para almacenar la cantidad de votos
  
    this.fotos.forEach(element => {
      if(element.votos.length != 0)
      {
        labels.push(element.email + ' - ' + this.mostrarFecha(element.fecha));
    
        // Contar la cantidad de "likes" y "dislikes"
        let likes = element.votos.filter(v => v.tipo === 'up').length;
        let dislikes = element.votos.filter(v => v.tipo === 'down').length;
    
        data.push(likes+dislikes);      
      } 
    });
  
    Chart.defaults.font.size = 16;
    this.chart = new Chart("MyChart", {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Votos",
            data: data,
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "bottom"
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            external: function(context) {              
            }
          }
        },
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {
            console.log(elements)
            this.onClickBarChart(elements[0].index);  
          }
        }
      },
      
    });
  }

  onClickBarChart(index:number){
    this.elementoSeleccionado =  this.fotos[index]
    this.modal.present();  
  } 

  
  votar(foto:Foto,tipo:'up'|'down'){
    if (!this.getVoto(foto)) {
      this.fotosService.addVoto(foto, this.auth.userLogged.email, tipo)
    } else {
      if(!this.getVotoTipo(foto,tipo))
      {
        this.fotosService.deleteVoto(foto, this.auth.userLogged.email)
      }else{
        this.fotosService.revertirVoto(foto, this.auth.userLogged.email)
      }
    }
  }

  votoArriba(foto: Foto) {
    this.votar(foto,'up')    
  }

  votoAbajo(foto: Foto) {
  this.votar(foto,'down')
  }

  getVotoTipo(foto: Foto, tipo: 'up' | 'down') {
    return foto.votos.some(voto => voto.email == this.auth.userLogged.email && voto.tipo == tipo)

  }

  getVoto(foto: Foto) {
    return foto.votos.some(voto => voto.email == this.auth.userLogged.email)
  }

  getCantidadVotos(foto: Foto,tipo:'up'|'down') {
    return foto.votos.filter(voto => voto.tipo == tipo).length  
  }
  
}
