import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild, ElementRef  } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, getDownloadURL, uploadBytesResumable,uploadBytes } from '@angular/fire/storage';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import { UserService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { NgForm } from '@angular/forms';

import { disableNetwork } from "firebase/firestore";
import { fotoPublicacionesServiceTsService } from 'src/app/services/fotopublicaciones.service';
import { NotificationService } from 'src/app/services/notificacion.service';
import { ErrorcodefirestoreService } from 'src/app/services/errorcodefirestore.service';


import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { MarcaModeloService } from 'src/app/services/marcaModelo.service';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent {

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

  
  
  registerPublicacion: FormGroup;

  idPublicacion: string = this.route.snapshot.params['id'];

  @ViewChild('publicacionesForm') publicacionesForm:NgForm;

  @ViewChild('botonMessage') botonMessage:any;

  @ViewChild('alertDeleteFotosPrincipal') alertDeleteFotosPrincipal:any;

  @ViewChild('alertDeleteFotos') alertDeleteFotos:any;

  

  percentDone: number;
  percentDoneFlag: boolean = false;

  percentDonePost: number;
  percentDonePostFlag: boolean = false;

  URLdownload: string='';
  
  isLoggedIn:boolean;
  LoggedInUser: string;

  imagenes: any[] =[];
  imgPrincipal: string;

  archivos:any[] =[];
  archivosPost:any[]= [];
  imagePrincipal:any[] =[];

  loading : boolean = false;
  loadingII : boolean = false;

  sendPublicacion: boolean = false;

  fotoPrincipal: Publicaciones[];
  urlFotoPrincipal:string = '';

  idfordeleteimage: string;
  urlfordeleteimage:string;

 

  estadosVenezuela: string[] = ['Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'];
 
  marcas: any[] =[];
  modelos: any[] =[];

 constructor(private toastr: ToastrService,
  private sanitizer: DomSanitizer,
  private storage: Storage,
  private router: Router,
  private fb: FormBuilder,
  private usuariosServicio:UsuariosServiceTsService,
  private publicacionesServicio:PublicacionesServiceTsService,
  private fotopublicaciones:fotoPublicacionesServiceTsService,
  private authService: UserService,
  private notificationService: NotificationService,
  private errorcodeFirestore: ErrorcodefirestoreService,
  private route: ActivatedRoute,
  private generatePass:FormatosServiceTsService,
  private marcaModelo:MarcaModeloService,
 ) { 
 

 
 this.registerPublicacion = this.fb.group({

  marca: ['', Validators.required],
  modelo: ['', Validators.required],
  ano: ['', Validators.required],
  km: ['', Validators.required],
  transmision: ['',Validators.required],
  unicodueno: ['',Validators.required],
  extra: [''],
  fallas: [''],
  aceptascambio: ['', Validators.required],
  precio:  ['', Validators.required],
  tipomoneda:['', Validators.required],
  ubicacion:['', Validators.required],
  
})

}


 ngOnInit() {


  this.authService.isLoggedIn();
  this.authService.getAuth().subscribe( auth =>{

    if (auth){

      this.authService.isLoggedIn();

      this.isLoggedIn = true;
      
      this.LoggedInUser = auth.email!;

      this.marcas = this.marcaModelo.marca();
      this.modelos = this.marcaModelo.modelos();

      
      this.publicacionesServicio.filterPublicacionId(this.idPublicacion)
      .subscribe((data) => {
    
      this.registerPublicacion.patchValue(data);
      this.cargarDeFotosPublicacion(this.idPublicacion,this.LoggedInUser);
        
      });
    

    }else{

      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
  })

}

buscarModeloPorMarca(){
  this.modelos = this.marcaModelo.modelos();

  const id_marca = this.marcas.filter(marca => marca.Nombre === this.registerPublicacion.value.marca); 
   
  this.modelos = this.modelos.filter(modelo => modelo.id_marca === id_marca[0].id);


}



cargarDeFotosPublicacion(id:string,email:string){

  this.loadingII = true;
//-----------------------Fotos Principal---------------------------------//    
  this.publicacionesServicio.filterPublicacionUsuarioId(id, email)
  .subscribe((data) => {
  
  for(const [key, value] of Object.entries(data)){
    this.imgPrincipal = value.fotoprincipal;
    this.urlFotoPrincipal = value.fotoprincipal;

   
  }
})
//-----------------------Fotos del Vehiculo---------------------------------//    


this.publicacionesServicio.filterFotoPublicacionUsuarioId(id, email)
.subscribe((data) => {
  this.archivos = data;
})
this.loadingII = false; 

}


cargarImageprincipal(event:any){
  this.loadingII = true;
  const file = event.target.files[0];
  this.imageProperty(event.target.files[0],(alto:any,ancho:any,peso:any,tipo:any)=>{
       const isComfirm= this.validaImage(alto,ancho,peso,tipo);
       if(isComfirm){
           this.extraerBase64(file).then((imagen:any) =>{

           this.imgPrincipal = imagen.base
           
           })
           this.imagePrincipal = [];
           this.imagePrincipal.push(file);   

           this.toastr.warning('Actualizando la foto, por favor espere...');

          //Eliminamos la Imagen Principal Anterior
          const imageUrl = this.urlFotoPrincipal;

          const imageName = imageUrl.substring(imageUrl.lastIndexOf("%2F") + 3, imageUrl.lastIndexOf("?"));
        
          const refImage = `${this.LoggedInUser}/PUBLICACIONES/${this.idPublicacion}/${imageName}`;

          this.publicacionesServicio.deletefotoStorage(refImage);
          

          //guardado de la foto Principal
          
          const nameImage = this.generatePass.generarPassword(10);
          const storageRefprev = ref(this.storage,`${this.LoggedInUser}/PUBLICACIONES/${this.idPublicacion}/${nameImage+this.imagePrincipal[0].name}`);
          const uploadTaskprev = uploadBytesResumable(storageRefprev, this.imagePrincipal[0])

          uploadTaskprev.on('state_changed',(snapshot) => {
              this.percentDoneFlag = true;
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.percentDone = progress;
              if(progress >= 100)  this.percentDoneFlag = false;
        }, (error) => {
            switch (error.code) {
                  case 'storage/unknown':
                      this.toastr.error(`Ha ocurrido un error inesperado al subir la imagen ${this.imagePrincipal[0].name} `,'Error al subir la Imagen');
                      break;
            }
        }, 
            () => { 

        //Actualizamos la Url y id de la foto Principal 
                getDownloadURL(uploadTaskprev.snapshot.ref).then((downloadURL) => {
                    
                  this.publicacionesServicio.updateField(this.idPublicacion, downloadURL)
                  .then( resp =>{  
                    
                    this.toastr.success('La foto principal ha sido actualizada','Foto Principal');
                  
                  })
                  .catch(error =>{
                    
                    this.toastr.error(this.errorcodeFirestore.firebaseError(error.code), 'Mensaje');

                  })
                  
                });
            }
        );


              }
              this.loadingII = false; 
        });
    
}


cargarImagenes(event:any){

  const file = event.target.files;
  this.loading = true;
  const totArchivos = this.archivos.length + file.length;
 

  if (totArchivos > 10){ 

     this.toastr.info(`Supera el limite permitido de (10) fotos`);
     this.loading = false;
  }else{
        
      for(let i = 0; i < file.length; i++){ 
        
            this.imageProperty(event.target.files[i],(alto:any,ancho:any,peso:any,tipo:any)=>{

            const isComfirm= this.validaImage(alto,ancho,peso,tipo);
      
            if(isComfirm){
              
                    this.archivosPost = file;  


                  this.toastr.warning('Actualizando foto, por favor espere...');
                  

                  const storageRef = ref(this.storage,`${ this.LoggedInUser}/PUBLICACIONES/${this.idPublicacion}/${this.archivosPost[i].name}`);
                  const uploadTask = uploadBytesResumable(storageRef, this.archivosPost[i]);

                  uploadTask.on('state_changed',
                  (snapshot) => {
                    this.percentDonePostFlag = true;
                    const progressPost = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.percentDonePost = progressPost;

                    if(progressPost >= 100)  this.percentDonePostFlag = false;
                 
                    
                  }, 
                  (error) => {
                    switch (error.code) {
                      case 'storage/unknown':
                        this.toastr.error(`Ha ocurrido un error inesperado al cargar la imagen ${this.archivosPost[i].name} `,'Error al cargar la Imagen');
                        break;
                    }
                  }, 
                  () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                        const docData = {
                          emailuser: this.LoggedInUser,
                          idpublicacion: this.idPublicacion,
                          urlfotopublicacion: downloadURL
                      }
                      
                      this.fotopublicaciones.Add(docData)
                     
                      this.toastr.success('La foto ha sido guardada','Fotos del Vehiculo');

                     
                    });
                  }
                );

                  
            } 
              this.loading = false; 
              
               
      
    });
  }
  
 
  }        
}




  comprobarConexion():boolean{

    if(navigator.onLine) {
            return true;
        } else {
            return false;
        }
    }
        
        
modificar(){

  const online=this.comprobarConexion();
  
 
  if(online){
    
    
  const docData = {
  marca: this.registerPublicacion.value.marca,
  modelo: this.registerPublicacion.value.modelo,
  ano: this.registerPublicacion.value.ano,
  km: this.registerPublicacion.value.km,
  transmision: this.registerPublicacion.value.transmision,
  unicodueno: this.registerPublicacion.value.unicodueno,
  extra:this.registerPublicacion.value.extra,
  fallas:this.registerPublicacion.value.fallas,
  aceptascambio:this.registerPublicacion.value.aceptascambio,
  precio:this.registerPublicacion.value.precio,
  tipomoneda:this.registerPublicacion.value.tipomoneda,
  idpublicacion:this.idPublicacion,
  ubicacion:this.registerPublicacion.value.ubicacion
  }

  //Modificacion de la Publicacion
  this.publicacionesServicio.updatePublicacion(docData)
  .then(data=>{

    
  this.toastr.success('La Publicación ha sido actualizada','Actualizar Publicación');
  
  })
  .catch(error=>{

    console.log(error);

  this.toastr.error(this.errorcodeFirestore.firebaseError(error.code), 'Mensaje');

  })


}else{

  this.toastr.error('No tienes conexion a Internet','Conexion');

}

}



  extraerBase64 = async ($event: any) => new Promise((resolve, reject): any =>{
    try{

      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base:reader.result, 
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



  imageProperty(event:any,callback:any){
    const  _URL = window.URL || window.webkitURL;
    const  img = new Image();
    img.src = _URL.createObjectURL(event);
    img.onload = () =>{
        callback(img.height, img.width,event.size,event.type.indexOf("image"));
  }  
}


validaImage(alto:any,ancho:any,peso:any,tipo:any):boolean{


  if(alto < 500 || ancho < 500) {
          
        this.toastr.error('Estás intentando subir archivos no válidos. 500px x 500px de tamaño mínimo','File not supported');
        return false;
        
  }

  if(tipo == -1) {

          this.toastr.error('Archivo no Soportado','File not supported');
          return false;
            
  }
  
  if(peso > 5242880) {
          this.toastr.error('Imagen demasiado grande(Max 5MB)','File not supported');
          return false;
  }
  
      return true
      
}

deleteImgPrincipal(){

    this.imgPrincipal = '';
    this.imagePrincipal = [];
    const imageUrl = this.urlFotoPrincipal;


  //obtengo el nombre de la imagen a borrar
  const imageName = imageUrl.substring(imageUrl.lastIndexOf("%2F") + 3, imageUrl.lastIndexOf("?"));
 
  const refImage = `${this.LoggedInUser}/PUBLICACIONES/${this.idPublicacion}/${imageName}`;

  
  const valor = '';
  this.publicacionesServicio.deletefotoStorage(refImage);
  this.publicacionesServicio.updateField(this.idPublicacion,valor);
  
  const alertDeleteFotosPrincipal = this.alertDeleteFotosPrincipal.nativeElement;
  alertDeleteFotosPrincipal.click();

  
}

deleteImagenes(id:string,imageUrl:string){

  this.idfordeleteimage = id;
  this.urlfordeleteimage = imageUrl;

  const alertDeleteFotos = this.alertDeleteFotos.nativeElement;
  alertDeleteFotos.click();

}

deleteImagen(){

 
  const imageUrl = this.urlfordeleteimage;
 
  const imageName = imageUrl.substring(imageUrl.lastIndexOf("%2F") + 3, imageUrl.lastIndexOf("?"));
 
  const refImage = `${this.LoggedInUser}/PUBLICACIONES/${this.idPublicacion}/${imageName}`;

  this.publicacionesServicio.deletefotoStorage(refImage);
  
  this.publicacionesServicio.deleteFotoPublicaciones(this.idfordeleteimage);

   const alertDeleteFotos = this.alertDeleteFotos.nativeElement;
  alertDeleteFotos.click();

}


deleteImg(index: number){

  this.imagenes.splice(index,1);


}

goBack(){

  location.reload();
}

goPublications(){

  this.router.navigate(['/publications']);
}

}//clase

