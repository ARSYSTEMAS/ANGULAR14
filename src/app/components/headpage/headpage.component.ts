import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { NotificationService } from 'src/app/services/notificacion.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-headpage',
  templateUrl: './headpage.component.html',
  styleUrls: ['./headpage.component.css']
})
export class HeadpageComponent {

  formSearch: FormGroup;
  
  cssUrl: string;
  cssUrl2: string;
  cssUrl3: string;

  isLoggedIn:boolean;
  LoggedInUser: any;
  username: string;
  nameUser: string;
  fotoUserUrl:string;
  usuarios: Usuarios[];
 
  notifications: any[] = [];
  numNotifications: any[] = [];
  notificacionesSub: string[] = [];
 

  constructor(
    private authService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private usuariosServicio:UsuariosServiceTsService,
    public notificationService: NotificationService,
    public sanitizer: DomSanitizer) {

      
    this.formSearch = this.fb.group({

      search: ['', Validators.required],
     
      
    })

    this.cssUrl = '/assets/css/style.css';
    this.cssUrl2 = '/assets/lib/animate/animate.min.css';
    this.cssUrl3 = '/assets/lib/owlcarousel/assets/owl.carousel.min.css';
  }

  ngOnInit(){

    this.authService.getAuth().subscribe( auth =>{

        if (auth){

        
                  this.notifications = this.notificationService.getNotifications();
              
                
                  this.notificationService.notificationsChanged.subscribe(
                    (notifications: string[]) => {
                      this.notifications = notifications;

                      //contador de notificaciones no leidas
                      this.numNotifications = this.notifications.filter(NoLeidas => NoLeidas.status == 'LN');
                                            
                    }
                  );
        
                this.isLoggedIn = true;
                this.LoggedInUser = auth.email;
                this.usuariosServicio.filterUsuario(this.LoggedInUser).subscribe(usuario => {

                        this.usuarios = usuario;

                        usuario.forEach( user => {

                        this.username = user.alias;
                        this.fotoUserUrl= user.imageProfileUrl;
                        this.nameUser= user.nombre;

                
                        })
                });
        
        }else{

            this.isLoggedIn = false;
        }
    })

    

  }

  ngOnDestroy() {
    
      this.notificationService.notificationsChanged.unsubscribe();
    
}


  logout(){

    this.authService.logout();
    this.toastr.info('La sesión se ha cerrado correctamente.', 'Cerrar Sesión');

  }


  eyesNotificacion(id:string){
    
    this.notificationService.updateFieldNotificacion(id,'L');
  }

 
  deleteNotificacion(id:string){

      this.notificationService.deleteNotificacion(id);

  }

  searchModelo(){

    const modelo = this.formSearch.value.search;

    const url = `/marketplace-search/modelo/${modelo.charAt(0).toUpperCase() + modelo.slice(1)}`;
    
    window.open(url, '_blank');
  }


}
