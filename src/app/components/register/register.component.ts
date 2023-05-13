import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import Usuarios from 'src/app/interfaces/usuarios.interface';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerUsers: FormGroup;
  loading:boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private usuariosServicio:UsuariosServiceTsService,
    private authService: UserService,
    private fb: FormBuilder){
    this.registerUsers = this.fb.group({

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],



    })


  }

  
  ngOnInit(){

    this.authService.getAuth().subscribe( auth =>{

      if (auth){

        this.router.navigate(['/home']);
        
      }
    })

    

  }

  registerUser(){
    const nombre = this.registerUsers.value.nombre;
    const apellido = this.registerUsers.value.apellido;
    const email = this.registerUsers.value.email;
    const password = this.registerUsers.value.password;
    const repeatPassword = this.registerUsers.value.repeatPassword;

    const docDataUsuario = {
      alias: "",
      direccion: "",
      documento: "",
      nombre: nombre + ' ' + apellido,
      email: email,
      telefono:"",
      imageProfileUrl:"",
    }

  if (email == ''){

    this.toastr.error('Debe introducir un email', 'Error');
    return;

  }else if (password == ''){

    this.toastr.error('Debe introducir una contraseña', 'Error');
    return;
  
  }else if (password !== repeatPassword){

      this.toastr.error('Las contraseñas introducidas no coinciden', 'Error');
      return;
  }

   this.loading = true;

   this.authService.register(this.registerUsers.value)
      .then((user) => {  
      this.authService.SendVerificationMail();
      this.loading = false;
      this.toastr.success('La Cuenta ha sido creada. Ya puedes iniciar sesión','Mensaje');
      this.usuariosServicio.Add(docDataUsuario);
      this.authService.logout();
      this.router.navigate(['/login']);
      })
      
      .catch((error) => {
      this.loading = false;
      this.toastr.error(this.authService.firebaseError(error.code), 'Mensaje');
      })
    
  }


}
