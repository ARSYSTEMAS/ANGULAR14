import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, TitleStrategy } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isUserGoogle: string ='';
  nombre:any;
  LoggedInUser: any;
  loginUsers: FormGroup;
  loading : boolean = false;
  

  usuarios: Usuarios[];

  currentUsuario = {
    id: '',
    alias:'',
    direccion: '',
    documento: '',
    nombre: '',
    email: '',
    telefono: '',
    imageProfileUrl:''
  }

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: UserService,
    private usuariosServicio:UsuariosServiceTsService,
    private fb: FormBuilder){
    this.loginUsers = this.fb.group({

  
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],


    })


  }

  ngOnInit(){

    this.authService.getAuth().subscribe( auth =>{//valida si esta logeado

      if (auth){ //esta logeado. 

        this.router.navigate(['/home']);
        
      }
    })

  }

  login(){

    const email = this.loginUsers.value.email;
    const password = this.loginUsers.value.password;

    if (email == ''){

      this.toastr.error('Debe introducir un email', 'Error');
      return;
  
    }else if (password == ''){
  
      this.toastr.error('Debe introducir una contraseña', 'Error');
      return;
    
    }
    this.loading = true;

      this.authService.login(this.loginUsers.value)//valida los datos 
      .then( user => {
        this.loading = false;

        if(user.user?.emailVerified){
        
          this.toastr.success('Sessión Iniciada correctamente.','Mensaje');
          this.router.navigate(['/home']);

        }else{
          
          this.router.navigate(['/verify-email']);

        }

      })
      .catch( (error) => {
        this.loading = false;
        this.toastr.error(this.authService.firebaseError(error.code), 'Mensaje');
      });

  }

  onGoogle(){

    this.authService.loginGoogle();

    this.authService.getAuth().subscribe(auth =>{
    

      if (auth){

        this.LoggedInUser = auth.email;
        this.nombre = auth.displayName;
        this.usuariosServicio.filterUsuario(this.LoggedInUser).subscribe(usuario => {

          this.usuarios = usuario;
         

          for(const [key, value] of Object.entries(usuario)){
            
            this.isUserGoogle = 'N';

          }

          if(this.isUserGoogle === ''){

            const docDataUsuario = {
              alias: "",
              direccion: "",
              documento: "",
              nombre:this.nombre,
              email:this.LoggedInUser,
              telefono:"",
              imageProfileUrl:"",
            }

            this.usuariosServicio.Add(docDataUsuario);
            this.toastr.info('Recuerda completar tus datos personales en tu perfil de usuario', 'Mensaje');
            this.router.navigate(['/profile']);

         }

        })  
   
  }


});



  }
}