import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/users.service';
import { DomSanitizer } from '@angular/platform-browser';

import { Storage, ref, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {


  percentDone: number;
  URLdownload: string='';
  imagenCargar:string='assets/img/photoUser/avatar.png'
  

  isLoggedIn:boolean;
  LoggedInUser: any;

  previsualizacion: string;
  archives: any = [];


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




  @ViewChild('usuarioForm') usuarioForm:NgForm;

  @ViewChild('botoncerrarModal') botoncerrarModal:ElementRef;

  constructor(
    private toastr: ToastrService,
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private router: Router,
    private usuariosServicio:UsuariosServiceTsService,
    private authService: UserService
  ){}


  
  ngOnInit(){

    this.authService.isLoggedIn();
    this.authService.getAuth().subscribe(auth =>{

      if (auth){

        this.authService.isLoggedIn();

        this.isLoggedIn = true;
        
        this.LoggedInUser = auth.email;
        
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

          if (this.currentUsuario.imageProfileUrl){

              this.imagenCargar = this.currentUsuario.imageProfileUrl;
          }
        
      
        });

      }else{

        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    })
  
   
  }

  modifyUser(form: any){

    this.usuariosServicio.update(form.value);
    this.usuarioForm.resetForm();
    this.CierraModal();
    this.toastr.info('Información Guardada Correctamente','Modificar');
  }

  private CierraModal(){

    this.botoncerrarModal.nativeElement.click();


  }

//Codigo con Cloud Storage
  UploadImage(event: any){


    const file = event.target.files[0];
    this.extraerBase64(file).then((imagen:any) =>{
      this.previsualizacion = imagen.base
    })

    const storageRef = ref(this.storage,`profile/${this.LoggedInUser}`);
    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.percentDone = progress;
      }, 
      (error) => {
        switch (error.code) {
          case 'storage/unknown':
            this.toastr.error('Ha ocurrido un error inesperado.','Error al cargar Imagen');
            break;
        }
      }, 
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        
          this.URLdownload = downloadURL;
          this.currentUsuario.imageProfileUrl = downloadURL;
          this.usuariosServicio.update(this.currentUsuario);
          this.toastr.info('La imagen ha sido cargada correctamente','Foto de perfil');

        });
      }
    );

  }



  extraerBase64 = async ($event: any) => new Promise((resolve, reject): any =>{
    try{

      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base:reader.result
        });

      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base:null
        })
      };

    } catch (e) {
      return null;
    }

  })

  deleteImage(){


  }

}
