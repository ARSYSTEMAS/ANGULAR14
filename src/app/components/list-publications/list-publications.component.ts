import { Component,ViewChild  } from '@angular/core'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Publicaciones from 'src/app/interfaces/publicaciones.interface';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import { UserService } from 'src/app/services/users.service';
import { Storage, ref, getDownloadURL, uploadBytesResumable,uploadBytes } from '@angular/fire/storage';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ErrorcodefirestoreService } from 'src/app/services/errorcodefirestore.service';
import { getStorage, deleteObject } from "firebase/storage";
import { Timestamp } from '@angular/fire/firestore';
import { NotificationService } from 'src/app/services/notificacion.service';




@Component({
  selector: 'app-list-publications',
  templateUrl: './list-publications.component.html',
  styleUrls: ['./list-publications.component.css']
})
export class ListPublicationsComponent {

  @ViewChild('alertDeletePublicacion') alertDeletePublicacion:any;
  
  @ViewChild('sendComprobante') sendComprobante:any;

  isLoggedIn:boolean;
  LoggedInUser: any;
  p: number = 1;
  publicaciones: Publicaciones[];
  Loadingpublicaciones:boolean=false;
  

  idfor:string;
  comprobante:any[] =[];


  percentDone: number;
  percentDoneFlag: boolean = false;



  constructor(
    private toastr: ToastrService,
    private authService: UserService,
    private router: Router,
    private publicacionesServicio:PublicacionesServiceTsService,
    private formatos:FormatosServiceTsService,
    private storage: Storage,
    private errorcodeFirestore: ErrorcodefirestoreService,
    private notificationService: NotificationService,

  ){}

  

  ngOnInit(){

   

    this.authService.getAuth().subscribe( auth =>{

    //validamos solo ingreso de usuarios que hallan realizado sesion
    this.authService.isLoggedIn();
      
      if (auth){

        this.authService.isLoggedIn();

        this.Loadingpublicaciones = true;

        this.isLoggedIn = true;
        
        this.LoggedInUser = auth.email;
        
        //filtramos todas las publicaciones del usuario
        this.publicacionesServicio.filterPublicacionUsuario(this.LoggedInUser).subscribe(publicaciones => {

            this.publicaciones = publicaciones;
            this.Loadingpublicaciones= false;
            
            
           
            
      });

     

      }else{

        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    })
  
   
  }

  IsEstatus(e:string){

    if(e == 'P'){

      return 'PENDIENTE POR PAGO';

    }else  if(e == 'PA'){

      return 'PAUSADA';

    }else  if(e == 'A'){

      return 'ACTIVA';
    
    }else  if(e == 'PR'){

      return 'COMPROBANTE EN REVISIÓN';

    }else{

      return;
    }


  }

  cargarComprobante(event:any){

    const sendComprobante = this.sendComprobante.nativeElement;
    sendComprobante.click();

    this.toastr.info('Procesando Espere...');
    
    const file = event.target.files[0];
     
    this.comprobante = [];
    this.comprobante.push(file);   
    const nameFile = this.comprobante[0].name;
    const extension = nameFile.slice((nameFile.lastIndexOf(".") - 1 >>> 0) + 2);
   
   
    this.publicacionesServicio.deleteComprobante(this.LoggedInUser,this.idfor);

    

   

    const storage = getStorage();
    // Create a reference to the file to delete
    const desertRef = ref(storage, `${this.LoggedInUser}/PUBLICACIONES/${this.idfor}/COMPROBANTE/${this.idfor}.${extension}`);

    // Delete the file
    deleteObject(desertRef).then(() => {
    this.toastr.info('Eliminando comprobante existentes...');
  

    }).catch((error) => {
      //this.toastr.error('No se encontraron comprobantes existentes');
    });

    const storageRefprev = ref(this.storage,`${this.LoggedInUser}/PUBLICACIONES/${this.idfor}/COMPROBANTE/${this.idfor}.${extension}`);
      
   
    const uploadTaskprev = uploadBytesResumable(storageRefprev, this.comprobante[0]);
     
    uploadTaskprev.on('state_changed',(snapshot) => {
      this.percentDoneFlag = true;
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.percentDone = progress;

      if(progress >= 100)  this.percentDoneFlag = false;

}, (error) => {
    switch (error.code) {
          case 'storage/unknown':
              this.toastr.error(`Ha ocurrido un error inesperado al subir la imagen ${this.comprobante[0].name} `,'Error al subir la Imagen');
              break;
    }
}, 
    () => { 

//Actualizamos la Url y id de la foto Principal 
        getDownloadURL(uploadTaskprev.snapshot.ref).then((downloadURL) => {
          const docData = {
            idpublicacion: this.idfor,
            emailuser: this.LoggedInUser,
            fecha:Timestamp.fromDate(new Date(Date.now())),
            urlcomprobante:downloadURL,
            estatuscomprobante:'PR',
          }
         
           this.publicacionesServicio.AddComprobante(docData)

           const docDataNotification = {
            emailuser: this.LoggedInUser,
            message:'Comprobante Enviado',
            details:'Revision en un plazo de 1 dia habil',
            status: 'LN',
            urlfoto:downloadURL,
            rutadetails: '/list-publications',
            iddetails:this.idfor,
            fecha:Timestamp.fromDate(new Date(Date.now()))
          }

          const docDataNotificationAutosUsados = {
            emailuser: 'autosusadosve@gmail.com',
            message:`enviado 1 comprobante ${this.LoggedInUser}`,
            details:`id: ${this.idfor}`,
            status: 'LN',
            urlfoto:downloadURL,
            rutadetails: 'nulo',
            iddetails:this.idfor,
            fecha:Timestamp.fromDate(new Date(Date.now()))
          }
          
          this.publicacionesServicio.updateEstatus(this.idfor,'PR');
          this.notificationService.Add(docDataNotification);
          this.notificationService.Add(docDataNotificationAutosUsados);
            
           this.toastr.success('El comprobante ha sido enviado para su revisión.','Comprobante de Pago');
    

        });
    }
);


  
  }

  modificar(id:string){

  
    this.router.navigate([`/publications/edit/${id}`]);

  }

  verPublicacion(id:string){

  
    this.router.navigate([`/publication-details/view/${id}`]);

  }

  sendIdPublication(id:string, mode:string){

    this.idfor= '';
    this.idfor = id;
  
  
        if (mode ==='eliminar'){
            const alertDeletePublicacion = this.alertDeletePublicacion.nativeElement;
            alertDeletePublicacion.click();

        }else if(mode ==='pagar'){

            const sendComprobante = this.sendComprobante.nativeElement;
            sendComprobante.click();
        }
  }

  delete(){
    
  const storageRef = `${this.LoggedInUser}/PUBLICACIONES/${this.idfor}`;

   this.publicacionesServicio.deletePublicacion(this.idfor);
   this.publicacionesServicio.deleteFotoIdPublicacion(this.idfor);
   this.publicacionesServicio.deleteComprobante(this.LoggedInUser,this.idfor);
   this.notificationService.deleteNotificacionId(this.idfor);
   this.publicacionesServicio.deletePreguntasId(this.idfor);
   this.publicacionesServicio.deletefotoStorage(storageRef);

   const alertDeletePublicacion = this.alertDeletePublicacion.nativeElement;
   alertDeletePublicacion.click();
  
   const docDataNotificationAutosUsados = {
    emailuser: 'autosusadosve@gmail.com',
    message:`Eliminaron publicacion ${this.LoggedInUser}`,
    details:`id: ${this.idfor}`,
    status: 'LN',
    urlfoto:'nulo',
    rutadetails: 'nulo',
    iddetails:this.idfor,
    fecha:Timestamp.fromDate(new Date(Date.now()))
  }
  
  this.notificationService.Add(docDataNotificationAutosUsados);


   this.toastr.success('Publicacion Eliminada','Eliminar Publicación');

  }

  pausarPublicacion(id:string){

    this.publicacionesServicio.updateEstatus(id,'PA');
    
    this.toastr.success('Tu Publicación ha sido excluida del MarketPlace','Pausar Publicación');
  }


  activarPublicacion(id:string){

    this.publicacionesServicio.updateEstatus(id,'A');
    
    this.toastr.success('Tu Publicación ha sido activada en el MarketPlace','Activar Publicación');
  }


  formatearPrecio(precio:number,tipoMoneda:string){

    return this.formatos.formatearValor(precio,tipoMoneda);
  }

  formatoNumerico(valor:number) {

    return this.formatos.formatoNumerico(valor);

  }
  
}
