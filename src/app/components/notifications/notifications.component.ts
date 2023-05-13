import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { NotificationService } from 'src/app/services/notificacion.service';
import { Notificacion }  from 'src/app/interfaces/notificacion.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  formato: any;
  usuarios: Usuarios[];
  isLoggedIn:boolean = false;
  LoggedInUser: string;
  IsNotificaciones: Notificacion[];

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
    private notificacion:NotificationService,
    private authService: UserService,
    private usuariosServicio:UsuariosServiceTsService,
    private router: Router,
    private toastr: ToastrService,
    private formatos:FormatosServiceTsService,
    private route: ActivatedRoute,

  ){

    this.formato = this.formatos;
  }



  ngOnInit() {

    this.authService.isLoggedIn();
    this.authService.getAuth().subscribe( auth =>{
  
      if (auth){
  
        this.authService.isLoggedIn();
  
        this.isLoggedIn = true;
        
        this.LoggedInUser = auth.email!;


        this.usuariosServicio.filterUsuario(this.LoggedInUser).subscribe(usuario => {

          this.usuarios = usuario;

          for(const [key, value] of Object.entries(usuario)){

            this.currentUsuario.direccion = value.direccion;
            this.currentUsuario.alias = value.alias;
            this.currentUsuario.documento = value.documento;
            this.currentUsuario.documento = value.documento;
            this.currentUsuario.nombre = value.nombre;
            this.currentUsuario.email = value.email;
            this.currentUsuario.telefono = value.telefono;
            this.currentUsuario.id = value.id!;
            this.currentUsuario.imageProfileUrl = value.imageProfileUrl;

          }


            
          // Notificaciones
          this.notificacion.filterNotifications(this.LoggedInUser)
          .subscribe((data) => {
            
            this.IsNotificaciones = data;

          });

        });
  
      }else{

      this.isLoggedIn = false;
      this.router.navigate(['/login']);

       }

    });
  
 



  }

  deleteNotificacion(id:any){

    this.notificacion.deleteNotificacion(id);
    this.toastr.info('Notificacion Eliminada', 'Notificación');

}

}