import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';


import { Foto } from 'src/app/classes/foto';
import { TipoCosa } from 'src/app/enums/tipoCosa';
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

  constructor(private fotosService: FotosService) { }
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
    let labels: Array<string> = [];
    let data: Array<number> = []; // Cambiado a Array<number> para almacenar la cantidad de votos
  
    this.fotos.forEach(element => {
      labels.push(element.email + ' - ' + this.mostrarFecha(element.fecha));
  
      // Contar la cantidad de "likes" y "dislikes"
      let likes = element.votos.filter(v => v.tipo === 'up').length;
      let dislikes = element.votos.filter(v => v.tipo === 'down').length;
  
      data.push(likes+dislikes);      
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
              console.log(context.chart.data)
            }
          }
        }
      }
    });
  }
  
}
