import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {

  constructor(
    private authService:UserService,
    private toastr: ToastrService,
    private router: Router){}


    
    ngOnInit(){

      this.authService.getAuth().subscribe( auth =>{
  
        if (!auth){//si no esta logeado
  
          this.router.navigate(['/login']);
          
        }else{

          if(auth.emailVerified){

            this.router.navigate(['/home']);
          }

        }
      })
  
      
  
    }

  goBack(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  SendVerificationMail(){

    this.authService.SendVerificationMail();

    this.toastr.info('El correo de verificación ha sido enviado exitosamente!!!','Reenviar email de verificación');

  }

}
