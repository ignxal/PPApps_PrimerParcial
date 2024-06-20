import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Customer } from 'src/app/classes/user/customer';

import { Profiles } from 'src/app/enums/profiles';
import { INotification } from 'src/app/interfaces/iNotification';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { FotosService } from 'src/app/services/fotos.service';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { PushNotificationsService } from 'src/app/services/push-notifications.service';
import { QrService } from 'src/app/services/qr.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private interceptor: InterceptorService,
    private auth:AuthFirebaseService,
    private toastService: ToastService,
    private router: Router,
    private fotosService: FotosService,
    private sanitizer: DomSanitizer,
    private usuariosService: UsuariosService,
    private push: PushNotificationsService,
    private qr: QrService) { }

  regForm!: FormGroup;
  get nombre() { return this.regForm.get('nombre'); }
  get apellido() { return this.regForm.get('apellido'); }
  get dni() { return this.regForm.get('dni'); }
  get foto() { return this.regForm.get('foto'); }
  get email() { return this.regForm.get('email'); }
  get password() { return this.regForm.get('password'); }
  get confirmPassword() { return this.regForm.get('confirmPassword'); }

  ngOnInit(): void {
    this.regForm = new FormGroup({
      nombre: new FormControl("", { validators: [Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-zÀ-ÿ ]+")], updateOn: 'change' }),
      apellido: new FormControl("", { validators: [Validators.required, Validators.minLength(2), Validators.pattern("[A-Za-zÀ-ÿ ]+")], updateOn: 'change' }),
      // dni: new FormControl("", { validators: [Validators.required, Validators.min(0), Validators.maxLength(99999999)], updateOn: 'change' }),
      // foto: new FormControl("", { validators: [Validators.required], updateOn: 'change' }),
      email: new FormControl("", { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      password: new FormControl("", { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(15)], updateOn: 'change' }),
      confirmPassword: new FormControl("", { validators: [Validators.required], updateOn: 'change' }),
    }, { validators: this.passwordMatchingValidatior });

    this.usuariosService.currentUserState.subscribe((person) => {
      if (person) {
        this.regForm.controls['nombre']?.setValue(person.name);
        this.regForm.controls['apellido']?.setValue(person.lastName);
        // this.regForm.controls['dni']?.setValue(person.dni);
      }
    })
  }

  passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };

  async save() {
    if (this.regForm.valid) {
      let nuevoCliente: Customer = new Customer("",
        this.nombre?.value!.toLowerCase().trim(),
        this.apellido?.value!.toLowerCase().trim(),
        // this.dni?.value!,        
        // this.foto?.value!,
        this.email?.value!,
        Profiles.Cliente,        
        this.password?.value!
      );

      this.auth.addUser(nuevoCliente,nuevoCliente.password)
        .then((result) => {
          if (result) {
            this.toastService.openSuccessToast('Usuario guardado exitosamente', 'top');
            // this.pushToAdmins(this.email?.value!);
            this.limpiarFormulario();
            setTimeout(() => { this.router.navigateByUrl('login') }, 1500);
          }
          else
            this.toastService.openErrorToast('No se pudo guardar el usuario', 'top');
        })
        .catch((error) => {
          this.toastService.openErrorToast(error, 'top');
        });
    }
  }

  test() {
    this.pushToAdmins('mailcito@mail.com');
  }

  async pushToAdmins(mail: string) {
    try {
      let myNotification: INotification = {
        title: "Cliente registrado: " + mail,
        description: "Se aguarda su aprobación"
      };
      console.log(myNotification)

      // this.usuariosService.getUsuariosAdmin().then(usuarios => {
      //   console.log(usuarios);
      //   usuarios.forEach(usuario => {
      //     this.push.sendPushNotification(myNotification, usuario);
      //   });
      // });
    }
    catch (e) {
      console.log('error push to admin', e);
    }
  }

  fotoSrc?: SafeResourceUrl = "";
  updFoto() {
    this.fotosService.takePhoto().then((photo) => {
      let data = "data:image/" + photo.format + ";base64,"
      this.fotoSrc = this.sanitizer.bypassSecurityTrustUrl(`${data} ${photo.base64String}`);
    })
  }

  delFoto() {
    this.fotoSrc = "";
    this.regForm.controls['foto']?.reset();
  }

  limpiarFormulario() {
    this.fotoSrc = "";
    this.regForm.reset();
  }

  @ViewChild('imagen') imagen: ElementRef | undefined;
  loadImg(event: any) {
    const img: HTMLImageElement = this.imagen?.nativeElement;
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    var canvas = document.createElement('canvas');
    var MAX_WIDTH = 350;
    var MAX_HEIGHT = 250;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0, width, height);
    var result = canvas.toDataURL();

    this.regForm.controls['foto']?.setValue(result);
  }


  leerQr() {
    this.qr.leerQr();
  }
}
