import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { Gastos } from 'src/app/classes/gastos';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { GastosService } from 'src/app/services/gastos.service';

@Component({
  selector: 'app-g-barra',
  templateUrl: './g-barra.component.html',
  styleUrls: ['./g-barra.component.scss'],
})
export class GBarraComponent implements OnInit {
  constructor(
    private gastosService: GastosService,
    private auth: AuthFirebaseService
  ) {}

  public chart: any;
  gastos!: Gastos;
  gastosSub!: Subscription;

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

  calcularGastoVsAhorroAnualizado() {
    // Obtén los movimientos de gastos de tu instancia de Gastos
    // Puedes usar estos valores para mostrar en tu gráfico de barras
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico anterior si existe
    }

    let datasetArr: any[] = [];
    let labels: string[] = [];

    const movimientos = this.gastos.movimientos;

    // Filtra los movimientos para obtener solo los del año actual
    const añoActual = new Date().getFullYear();
    const gastosDelAño = movimientos.filter(
      (gasto) => gasto.fecha.toDate().getFullYear() === añoActual
    );

    // Calcula el gasto total del año actual
    const gastoTotal = gastosDelAño.reduce(
      (total, gasto) => total + gasto.monto,
      0
    );

    // Calcula el ahorro anualizado
    const ahorroAnualizado =
      ((this.gastos.ingresos * (100 - this.gastos.margen)) / 100) * 12;

    // Calcula la barra del gasto
    const barraGasto = gastoTotal;

    // Calcula la barra del ahorro
    const barraAhorro = ahorroAnualizado;

    // Ahora, tienes las barras del gasto y ahorro anualizado
    console.log('Barra del Gasto:', barraGasto);
    console.log('Barra del Ahorro:', barraAhorro);

    datasetArr.push({
      label: 'Gastos',
      labels: ['Gasto', 'Ahorro anualizado'],
      data: [barraGasto, barraAhorro],
      backgroundColor: ['red', 'green'],
    });

    Chart.defaults.font.size = 18;
    Chart.defaults.color = '#000';
    Chart.defaults.borderColor = '#000';
    this.chart = new Chart('MyChartBarr', {
      type: 'bar',
      data: {
        labels: ['Gasto', 'Ahorro anualizado'],
        datasets: datasetArr,
      },
      options: {
        plugins: {
          legend: {
            display: false,
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
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
