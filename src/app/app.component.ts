import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from './services/users.service';
import { NotificationService } from 'src/app/services/notificacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Autos Usados App';
  cssUrl: string;

  isLoggedIn:boolean;
  LoggedInUser: any;



  constructor(
    public notificationService: NotificationService,
    private authService: UserService,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer) {

    this.cssUrl = '/assets/css/style.css';
  }

    ngOnInit() {
      const online=this.comprobarConexion();
      this.authService.getAuth().subscribe( auth =>{

        if (auth){

          this.authService.isLoggedIn();
          
          this.isLoggedIn = true;
          
          this.LoggedInUser = auth.email;

          this.notificationService.addNotification(this.LoggedInUser);
    
        }else{
  
          this.isLoggedIn = false;
        }
      })
  
    if(!online){

      this.toastr.warning('No tienes conexion a internet');
      
    }

  
    }

    comprobarConexion():boolean{

      if(navigator.onLine) {
              return true;
          } else {
              return false;
          }
      }


    ngOnDestroy() {

   

    }

  

}
