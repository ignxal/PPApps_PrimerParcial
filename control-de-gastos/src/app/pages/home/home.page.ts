import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Gasto } from 'src/app/classes/gasto';
import { Gastos } from 'src/app/classes/gastos';
import { Person } from 'src/app/classes/user/person';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { GastosService } from 'src/app/services/gastos.service';
import { InterceptorService } from 'src/app/services/interceptor.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,OnDestroy {
  usuario!: Person;
  gasto!: number|null
  umbralGasto: number = 100

  gastoOpen: boolean = false

  gastos: Gastos = new Gastos('',this.usuario?.email,0,0,[])
  gastosSub!: Subscription

  gastosUltimoMes: number = 0

  selectedCategoria: string = ''

  abrirNuevoGasto() {
    this.gastoOpen = !this.gastoOpen
  }

  constructor(private auth: AuthFirebaseService, private router: Router, private modalController: ModalController, private gastosService: GastosService,private interceptor:InterceptorService) { }
  ngOnDestroy(): void {
    this.gastosSub?.unsubscribe()
  }

  ngOnInit(): void {
    // Lógica de inicialización, obtención de datos de usuario, etc.
    this.interceptor.updateOverlayState(true)
    this.usuario = this.auth.userLogged
    this.gastosSub = this.gastosService.get(this.usuario.email).subscribe(gastos => {
      console.log(gastos)
      if(gastos.length>0)
      {
        this.gastos = gastos[0]
        this.gastosUltimoMesFn(this.gastos)
      }
      else{
        console.log('add')
        let gasto = new Gastos('',this.usuario.email,0,0,[])
        this.gastosService.add(gasto).then((nuevo) => this.gastos.id = nuevo.id)
      }
      this.interceptor.updateOverlayState(false)

      this.calcularGastoVsAhorroAnualizado()
    });
  }

  irACosasLindas() {
    this.router.navigateByUrl('cosas-lindas');
  }

  irACosasFeas() {
    this.router.navigateByUrl('cosas-feas');
  }

  guardarGasto(){
    
    const gasto = {fecha: Timestamp.now(), monto:this.gasto,categoria:this.selectedCategoria} as Gasto
    this.gastos.movimientos.unshift(gasto)    
    this.gastoOpen = false  
    this.gastosService.update(this.gastos)
    this.gasto = null
  }

  // Variables para el modal
  modalAbierto: boolean = false;
  modalTitulo: string = '';
  nuevoMonto: number = 0;

  // Función para abrir el modal con el título especificado
  async abrirModal(titulo: string) {
    if (this.modalAbierto && this.modalTitulo == titulo) {
      this.cerrarModal()
    } else {

      this.modalTitulo = titulo;
      this.nuevoMonto = titulo === 'Ingreso Mensual' ? this.gastos.ingresos : this.gastos.margen;
      this.modalAbierto = true;
    }

  }

  // Función para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
    this.modalController.dismiss();
  }

  // Función para guardar el nuevo monto después de editar en el modal
  guardarNuevoMonto() {
    if (this.modalTitulo === 'Ingreso Mensual') {
      this.gastos.ingresos = this.nuevoMonto;
    } else if (this.modalTitulo === 'Umbral de Gasto (%)') {
      this.gastos.margen = this.nuevoMonto;
    }

    this.gastosService.update(this.gastos)

    this.cerrarModal();
  }

  gastosUltimoMesFn(gastos: Gastos) {
    this.gastosUltimoMes = 0
    gastos.movimientos.filter(movimiento => {
      if (movimiento.fecha.toDate().getMonth() == new Date().getMonth()) {
        this.gastosUltimoMes += movimiento.monto
      }
    })
  }

 

  getDanger(){
    return  this.gastosUltimoMes! > this.gastos.ingresos*this.gastos.margen/100
  }

  calcularGastoVsAhorroAnualizado() {
    // Obtén los movimientos de gastos de tu instancia de Gastos
    const movimientos = this.gastos.movimientos;

    // Filtra los movimientos para obtener solo los del año actual
    const añoActual = new Date().getFullYear();
    const gastosDelAño = movimientos.filter(gasto => gasto.fecha.toDate().getFullYear() === añoActual);

    // Calcula el gasto total del año actual
    const gastoTotal = gastosDelAño.reduce((total, gasto) => total + gasto.monto, 0);

    // Calcula el ahorro anualizado
    const ahorroAnualizado = this.gastos.ingresos * this.gastos.margen/100;

    // Calcula la barra del gasto
    const barraGasto = gastoTotal / ahorroAnualizado * 100;

    // Calcula la barra del ahorro
    const barraAhorro = 100 - barraGasto;

    // Ahora, tienes las barras del gasto y ahorro anualizado
    console.log('Barra del Gasto:', barraGasto);
    console.log('Barra del Ahorro:', barraAhorro);

    // Puedes usar estos valores para mostrar en tu gráfico de barras
  }

  // Resto de la lógica del componente...
}