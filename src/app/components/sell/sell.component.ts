import { Component, ViewChild  } from '@angular/core';
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
import { MarcaModeloService } from 'src/app/services/marcaModelo.service';


@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent {

  registerPublicacion: FormGroup;

  @ViewChild('publicacionesForm') publicacionesForm:NgForm;

  @ViewChild('botonMessage') botonMessage:any;


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

  percentDone: number;
  URLdownload: string='';
  
  isLoggedIn:boolean;
  LoggedInUser: any;

  imagenes: any[] =[];
  imgPrincipal: string;

  archivos:any[] =[];
  imagePrincipal:any[] =[];

  loading : boolean = false;
  loadingII : boolean = false;
  sendPublicacion: boolean = false;

  showBanner = false;

  estadosVenezuela: string[] = ['Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'];

   marcas: any[] =[];
   modelos: any[] =[];
 
  
  constructor(
    private toastr: ToastrService,
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
    private marcaModelo:MarcaModeloService,
  ){ 

    this.registerPublicacion = this.fb.group({

      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      ano: ['', Validators.required],
      km: ['', Validators.required],
      transmision: ['',Validators.required],
      unicodueno: ['',Validators.required],
      extras: [''],
      fallas: [''],
      aceptascambios: ['', Validators.required],
      precio:  ['', Validators.required],
      tipomoneda:['', Validators.required],
      fotoprincipal:['', Validators.required],
      ubicacion:['', Validators.required],
      
    })


  }


  ngOnInit(){

    //this.authService.isLoggedIn();
    this.authService.getAuth().subscribe( auth =>{

      if (auth){

        this.authService.isLoggedIn();

        this.isLoggedIn = true;
        
        this.LoggedInUser = auth.email;
        
        this.marcas = this.marcaModelo.marca();
        this.modelos = this.marcaModelo.modelos();
        
        this.usuariosServicio.filterUsuario(this.LoggedInUser).subscribe(usuario => {

         
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
        });


        

      }else{
        this.showBanner=true;
        
        setTimeout(() => {
          this.showBanner = false;
          this.router.navigate(['/login']);
        }, 5000);


       
        

      }
    })
  
   
  }

  hideBanner() {
    this.showBanner = false;
  }


  buscarModeloPorMarca(){
       this.modelos = this.marcaModelo.modelos();

       const id_marca = this.marcas.filter(marca => marca.Nombre === this.registerPublicacion.value.marca); 
    
       this.modelos = this.modelos.filter(modelo => modelo.id_marca === id_marca[0].id);
      
      if(this.modelos?.length == 0){
        
        this.modelos = this.marcaModelo.modelos();
        
        this.modelos = this.modelos.filter(modelo => modelo.id_marca == 80);

      }   
    

  }



comprobarConexion():boolean{

if(navigator.onLine) {
        return true;
    } else {
        return false;
    }
}


publicar(){

  const online=this.comprobarConexion();
  
  this.sendPublicacion = true;

  if ((this.imagenes.length >= 1) && this.archivos.length > 10){
    
    this.toastr.info(`Por favor elimine ${(this.archivos.length -10)} foto ya que supera el limite permitido de (10)`);
   
  }else if(online){
    
   
  const docData = {
  marca: this.registerPublicacion.value.marca,
  modelo: this.registerPublicacion.value.modelo,
  ano: this.registerPublicacion.value.ano,
  km: this.registerPublicacion.value.km,
  transmision: this.registerPublicacion.value.transmision,
  unicodueno: this.registerPublicacion.value.unicodueno,
  extra:this.registerPublicacion.value.extras,
  fallas:this.registerPublicacion.value.fallas,
  aceptascambio:this.registerPublicacion.value.aceptascambios,
  precio:this.registerPublicacion.value.precio,
  tipomoneda:this.registerPublicacion.value.tipomoneda,
  fotoprincipal:'',
  idpublicacion:'',
  //fechapublicacion: Timestamp.fromDate(new Date(Date.now())),
  fechapublicacion: serverTimestamp(),
  ubicacion:this.registerPublicacion.value.ubicacion,
  estatuspublicacion:'P', //P= PENDIENTE - PA= PAUSADA - A= APROBADA  - PR= COMPROBANTE POR REVISAR
  emailuser:this.currentUsuario.email,

  }

 //Registro de la Publicacion y foto Principal
 this.publicacionesServicio.Add(docData)
 .then(data=>{

 
  //cargamos las fotos generales si las hay
  this.uploadImagenes(data.id);
 
  const botonEnviar = document.getElementById("botonEnviar") as HTMLInputElement;
  botonEnviar.textContent='Enviando, Espere por favor...';
  
  
   //guardado de la foto Principal
  const storageRefprev = ref(this.storage,`${this.LoggedInUser}/PUBLICACIONES/${data.id}/${this.imagePrincipal[0].name}`);
    
 
  const uploadTaskprev = uploadBytesResumable(storageRefprev, this.imagePrincipal[0])
 
  uploadTaskprev.on('state_changed',(snapshot) => {
     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.percentDone = progress;
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
            this.publicacionesServicio.updateField(data.id, downloadURL)
            .then( resp =>{
            const docData = {
              emailuser: this.currentUsuario.email,
              message:'Publicación Registrada',
              details: this.registerPublicacion.value.marca +' '+ this.registerPublicacion.value.modelo,
              status: 'LN',
              urlfoto:downloadURL,
              rutadetails: '/list-publications',
              iddetails: data.id,
              fecha:Timestamp.fromDate(new Date(Date.now()))
            }
            //this.notificationService.sendNotification('primera notificación');   
            const docDataAutosUsados = {
              emailuser:'autosusadosve@gmail.com',
              message:'Han publicado 1 vehiculo',
              details: this.registerPublicacion.value.marca +' '+ this.registerPublicacion.value.modelo+' '+data.id,
              status: 'LN',
              urlfoto:downloadURL,
              rutadetails: 'nulo',
              iddetails: data.id,
              fecha:Timestamp.fromDate(new Date(Date.now()))
            }

            this.notificationService.Add(docData);
            this.notificationService.Add(docDataAutosUsados);
           
            //reseteamos el formulario.
            this.archivos =[];
            this.imagePrincipal=[];
            this.imgPrincipal = '';
            this.imagenes =[];
            this.publicacionesForm.resetForm();
           
            
            const botonEnviar = document.getElementById("botonEnviar") as HTMLInputElement;
            botonEnviar.textContent='Publicación Enviada...';

            const botonMessage = this.botonMessage.nativeElement;
            botonMessage.click();

            })
            .catch(error =>{
              
              this.toastr.error(this.errorcodeFirestore.firebaseError(error.code), 'Mensaje');

            })
            
          });
      }
  );

 })
 .catch(error=>{

  this.toastr.error(this.errorcodeFirestore.firebaseError(error.code), 'Mensaje');

 })


}else{

  this.toastr.error('No tienes conexion a Internet','Conexion');

}

}


uploadImagenes(idpublicacion:string){

  for(let i =0; i < this.archivos.length; i++){

      const storageRef = ref(this.storage,`${ this.LoggedInUser}/PUBLICACIONES/${idpublicacion}/${this.archivos[i].name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.archivos[i]);

      uploadTask.on('state_changed',
      (snapshot) => {
      }, 
      (error) => {
        switch (error.code) {
          case 'storage/unknown':
            this.toastr.error(`Ha ocurrido un error inesperado al cargar la imagen ${this.archivos[i].name} `,'Error al cargar la Imagen');
            break;
        }
      }, 
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

            const docData = {
              emailuser: this.currentUsuario.email,
              idpublicacion: idpublicacion,
              urlfotopublicacion: downloadURL
          }
          
          this.fotopublicaciones.Add(docData);
    
        });
      }
    );
 
  }
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

            this.imagePrincipal.push(file);          
        }
        this.loadingII = false; 
  });
  
   
      
   
}
  cargarImagenes(event:any){
    this.loading = true;
    const file = event.target.files;
       
        for(let i = 0; i < file.length; i++){ 
          
              this.imageProperty(event.target.files[i],(alto:any,ancho:any,peso:any,tipo:any)=>{

              const isComfirm= this.validaImage(alto,ancho,peso,tipo);
        
              if(isComfirm){
                      this.extraerBase64(file[i]).then((imagen:any) =>{
                        this.imagenes.push(imagen.base);
                      })
                      this.archivos = file;  
              } 
               this.loading = false; 
        
      });
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
}

deleteImg(index: number){

  this.imagenes.splice(index,1);
  this.archivos.splice(index,1);


}

goBack(){

  location.reload();
}

goPublications(){

  const botonMessage = this.botonMessage.nativeElement;
  botonMessage.click();

  this.router.navigate(['/list-publications']);
}
}//clase
