import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { IonModal } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { Foto } from 'src/app/classes/foto';
import { TipoCosa } from 'src/app/enums/tipoCosa';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';


import { FotosService } from 'src/app/services/fotos.service';

@Component({
  selector: 'app-g-barra',
  templateUrl: './g-barra.component.html',
  styleUrls: ['./g-barra.component.scss'],
})
export class GBarraComponent implements OnInit {
 
  elementoSeleccionado!: Foto

  @ViewChild('openModalButton', { read: ElementRef }) openModalButton!: ElementRef;
  @ViewChild('modal') modal!: IonModal;

  constructor(private fotosService: FotosService,private auth:AuthFirebaseService) { }

  public chart: any;
  fotos: Foto[] = [];

  ngOnInit() {
    this.traerObjetos();
  }

  traerObjetos() {
    this.fotosService.getFotos(TipoCosa.Fea).subscribe((informacion) => {
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

    let datasetArr: any[] = [];
    let labels: string[] = [];
  
    this.fotos.forEach((element, index) => {
      if(element.votos.length !== 0){
        let likes = element.votos.filter(v => v.tipo === 'up').length;
        let dislikes = element.votos.filter(v => v.tipo === 'down').length;
    
        datasetArr.push({
          label: element.email + ' - ' + this.mostrarFecha(element.fecha),
          labels: ['Me gusta', 'No me gusta'],
          data: [likes, dislikes],
          backgroundColor: ['green', 'red']
        });
    
        // Agregar un índice como etiqueta para cada conjunto de datos
        labels.push(element.email + ' - ' + this.mostrarFecha(element.fecha));
      }
    });
  
    Chart.defaults.font.size = 18;
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: ['Me gusta','No me gusta'],
        datasets: datasetArr,
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
              console.log(context.chart.data)
            }
          }
        },
        scales: {
          x: {            
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          }
        },
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {           
            this.onClickBarChart(elements[0].datasetIndex);
          }
        }
      }
    });
  }

  onClickBarChart(index:number){
    this.elementoSeleccionado =  this.fotos[index];
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
