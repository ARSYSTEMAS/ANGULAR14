import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ToastrService } from 'ngx-toastr';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import Publicaciones from 'src/app/interfaces/publicaciones.interface';
import { getStorage, deleteObject } from "firebase/storage";
import { Storage, ref, getDownloadURL, uploadBytesResumable,uploadBytes } from '@angular/fire/storage';
import { Timestamp } from '@angular/fire/firestore';
import { NotificationService } from 'src/app/services/notificacion.service';
import { ComprobantePago } from 'src/app/interfaces/comprobantepago.interface';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent {

  @ViewChild('pagar') pagar:any;
  
  formato: any;
  usuarios: Usuarios[];
  isLoggedIn:boolean = false;
  LoggedInUser: string;
  IsFacturacion: Publicaciones[];
  IsComprobante: ComprobantePago[];
  idfor:string;
  comprobante:any[] =[];

  percentDone: number;
  percentDoneFlag: boolean = false;

  urlFotoModal:string='';
  @ViewChild('sendUrlImage') sendUrlImage:any;


  formattedToday = Timestamp.fromDate(new Date(Date.now()))

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
    private comprobantes:PublicacionesServiceTsService,
    private authService: UserService,
    private usuariosServicio:UsuariosServiceTsService,
    private publicacionesServicio:PublicacionesServiceTsService,
    private router: Router,
    private toastr: ToastrService,
    private storage: Storage,
    private formatos:FormatosServiceTsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,

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


            
          // Comprobantes
          this.comprobantes.filterFacturas(this.LoggedInUser)
          .subscribe((data) => {
            
            this.IsFacturacion = data;

          });

        });
  
      }else{

      this.isLoggedIn = false;
      this.router.navigate(['/login']);

       }

    });
  
 



  }



  pagarFactura(id:string){

    this.idfor= '';
    this.idfor = id;

    const sendPago = this.pagar.nativeElement;
    sendPago.click();
          
    
  
  }



  cargarComprobante(event:any){

    const sendComprobante = this.pagar.nativeElement;
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
          
          this.notificationService.Add(docDataNotificationAutosUsados);
          
          this.publicacionesServicio.updateEstatus(this.idfor,'PR');
          this.notificationService.Add(docDataNotification);
            
           this.toastr.success('El comprobante ha sido enviado para su revisión.','Comprobante de Pago');
    

        });
    }
);


  
  }


 
  sendUrlFotoModal(id:string){

    this.urlFotoModal ='';
    
    // Comprobantes
    this.comprobantes.filterComprobante(id)
    .subscribe((data) => {
      
      this.urlFotoModal = data[0].urlcomprobante;

    });
   

    const sendUrlImage = this.sendUrlImage.nativeElement;
    sendUrlImage.click();

  }

}
