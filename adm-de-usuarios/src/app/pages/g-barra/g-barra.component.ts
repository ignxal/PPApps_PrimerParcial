import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Chart } from 'chart.js/auto';
import { Foto } from 'src/app/classes/foto';
import { TipoCosa } from 'src/app/enums/tipoCosa';


import { FotosService } from 'src/app/services/fotos.service';

@Component({
  selector: 'app-g-barra',
  templateUrl: './g-barra.component.html',
  styleUrls: ['./g-barra.component.scss'],
})
export class GBarraComponent implements OnInit {
 
  constructor(private fotosService: FotosService) { }

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
    let datasetArr: any[] = [];
    let labels: string[] = [];
  
    this.fotos.forEach((element, index) => {
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
        }
      }
    });
  }
}
