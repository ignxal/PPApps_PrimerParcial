import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';

import { Gastos } from 'src/app/classes/gastos';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { GastosService } from 'src/app/services/gastos.service';

@Component({
  selector: 'app-g-torta',
  templateUrl: './g-torta.component.html',
  styleUrls: ['./g-torta.component.scss'],
})
export class GTortaComponent implements OnInit, OnDestroy {
  public chart: any;

  gastos!: Gastos;
  gastosSub!: Subscription;

  constructor(
    private gastosService: GastosService,
    private auth: AuthFirebaseService
  ) {}
  ngOnDestroy(): void {
    // this.gastosSub?.unsubscribe();
  }

  ngOnInit() {
    this.traerObjetos();
  }

  traerObjetos() {
    this.gastosSub = this.gastosService
      .get(this.auth.userLogged.email)
      .subscribe((informacion) => {
        console.log(informacion);
        this.gastos = informacion[0];
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

    //traer solo las categorias
    let categoriasA = this.gastos.movimientos.map(
      (movimiento) => movimiento.categoria
    );
    let categorias = [...new Set(categoriasA)];

    categorias.forEach((categoria) => {
      let gasto = 0;
      this.gastos.movimientos.forEach((movimiento) => {
        if (movimiento.categoria == categoria) {
          gasto += movimiento.monto;
        }
      });
      labels.push(categoria.toLocaleUpperCase());
      data.push(gasto);
    });

    console.log(labels);

    Chart.defaults.font.size = 16;
    Chart.defaults.color = '#000';
    Chart.defaults.borderColor = '#000';
    this.chart = new Chart('MyChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Gastos',
            data: data,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            external: function (context) {
              console.log(context.chart.data);
            },
          },
        },
      },
    });
  }
}
