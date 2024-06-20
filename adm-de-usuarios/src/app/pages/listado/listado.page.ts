import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Person } from 'src/app/classes/user/person';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit,OnDestroy {

  usuariosArr:Person[] = []
  usuariosSub!:Subscription
  constructor(private usuariosSv:UsuariosService,private interceptor:InterceptorService) { }
  ngOnDestroy(): void {
    this.usuariosSub?.unsubscribe()
  }

  ngOnInit() {
    this.interceptor.updateOverlayState(true)
    this.usuariosSub = this.usuariosSv.getUsuariosSnapshot().subscribe((data) => {
      this.interceptor.updateOverlayState(false)
      this.usuariosArr = data    
    })
  }

}
