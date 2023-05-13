import {Injectable} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'

})
export class UserService{

  
    constructor(
      private afAuth: AngularFireAuth, 
      private toastr: ToastrService,
      private router: Router,

      private auth: Auth){}


    register({ email, password }: any){

        return createUserWithEmailAndPassword(this.auth,email,password);
    
    }


    login({ email, password }: any){

      return signInWithEmailAndPassword(this.auth,email,password);

    }

    loginGoogle(){

      return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

    reset({email}: any){

      return sendPasswordResetEmail(this.auth,email);
    }

    SendVerificationMail() {

      return this.afAuth.currentUser

        .then((u: any) => u.sendEmailVerification())

        .catch( (error) => {
          this.toastr.error(this.firebaseError(error.code), 'Mensaje');
        
        });

    }


    logout(){

      return signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
    
    }

    isLoggedIn() {


      this.afAuth.currentUser

      .then( user =>{
        
        if (user !== null && user.emailVerified == false){

          this.router.navigate(['/verify-email']);
            
        }else{

         return;

        }
      
      })
      .catch ( error =>{  console.log('NUEVO ERROR '+ error)});
    }

    getAuth(){

      return this.afAuth.authState.pipe(

        map(auth => auth)
      );
    }

    firebaseError(code:string){

        switch(code){
    
          case 'auth/email-already-in-use':
            return 'El correo ya está registrado en Mercado Online';
          case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres';
          case 'auth/invalid-email':
            return 'El email no es valido. Verifique e ingrese una direccion de correo valida';
          case 'auth/internal-error':
              return 'El servidor de autenticación encontró un error inesperado al intentar procesar la solicitud.';
          case 'auth/wrong-password':
              return 'Contraseña incorrecta';
          case 'auth/user-not-found':
              return 'El correo de usuario no se encuentra registrado';
          case 'auth/internal-error':
              return 'No se ha podido establecer conexión con la bases de datos.'; 
          case 'auth/missing-email':
                return 'La cuenta correo no se encuentra registrada';            
          case 'auth/too-many-requests':
                  return 'La cuenta de correo ha tenido demasiadas solicitudes de verificación. Intente con otra cuenta de correo'; 
          case 'auth/network-request-failed':
            return 'Ha fallado la conexion con el servidor y/o internet'; 
          default:
            return 'Error desconocido y/o conexion a internet. Actualize la pagina'; 
        }
    
    }

}