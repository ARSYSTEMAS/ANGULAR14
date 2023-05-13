import { Component,ViewChild,  OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import { UserService } from 'src/app/services/users.service';
import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { serverTimestamp } from 'firebase/firestore';
import { NotificationService } from 'src/app/services/notificacion.service';
import { Timestamp } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import  Preguntas  from 'src/app/interfaces/preguntas.interface';



@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.css']
})
export class PublicationDetailsComponent implements OnInit {
  @ViewChild('preguntarForm') preguntarForm:NgForm;
  @ViewChild('respuestaForm') respuestaForm:NgForm;
  @ViewChild('botonPreguntar') botonPreguntar:any;

  formatearFecha: any;
  registerPregunta: FormGroup;
  registerRespuesta: FormGroup;
  
  idPublicacion: string = this.route.snapshot.params['id'];

  isLoggedIn:boolean = false;
  LoggedInUser: string;
  Ispublicacion : Publicaciones[];
  loading : boolean = false;
  emailuserTo: string;
  urlFotoemailFrom: string;
  urlFotoemailTo:string;
  

  urlFotoPrincipal:string = '';
  archivos:any[] =[];

  usuarios: Usuarios[];
  preguntas : Preguntas[];

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


  DatosVendedor = {
    id: '',
    alias:'',
    direccion: '',
    documento: '',
    nombre: '',
    email: '',
    telefono: '',
    imageProfileUrl:''
  }

  urlFotoModal:string='';
  @ViewChild('sendUrlImage') sendUrlImage:any;

  constructor(
    private route: ActivatedRoute,
    private publicacionesServicio:PublicacionesServiceTsService,
    private authService: UserService,
    private router: Router,
    private formatos:FormatosServiceTsService,
    private usuariosServicio:UsuariosServiceTsService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private toastr: ToastrService,

  ){

    this.registerPregunta = this.fb.group({

      pregunta: ['', Validators.required],
     
      
    })

    this.registerRespuesta = this.fb.group({

      respuesta: ['', Validators.required],
     
      
    })

    this.formatearFecha = this.formatos;
  
    
    
  }


  


  ngOnInit() {

     //Publicacion
     this.publicacionesServicio.filterPublicacion(this.idPublicacion)
     .subscribe((data) => {
       this.loading = true;
       this.Ispublicacion = data;
       this.SearchDatosVendedor(data[0].emailuser);
       const emailuserPub = this.Ispublicacion
       emailuserPub.forEach(emailIs =>{
         this.emailuserTo = emailIs.emailuser;
       })

       //Preguntas de la publicacion
       this.publicacionesServicio.filterPreguntas(this.idPublicacion)
       .subscribe((preguntas) => {
         this.preguntas = preguntas;
         this.searchFotoUrl(preguntas[0].emailuserFrom);
         this.searchFotoUrlUserTo(preguntas[0].emailuserTo);
       })

       //carga de las fotos de la publicacion
       this.cargarDeFotosPublicacion(this.idPublicacion);

     });


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

        });
  

      }
    })
  
   
   
  }
  
  formatearPrecio(precio:number,tipoMoneda:string){

    return this.formatos.formatearValor(precio,tipoMoneda);
  }

  formatoNumerico(valor:number) {

    return this.formatos.formatoNumerico(valor);

  }

  cargarDeFotosPublicacion(id:string){

    
  //-----------------------Fotos Principal---------------------------------//    
    this.publicacionesServicio.filterPublicacion(id)
    .subscribe((data) => {
    
    for(const [key, value] of Object.entries(data)){
      this.urlFotoPrincipal = value.fotoprincipal;
  
     
    }
  })
  //-----------------------Fotos del Vehiculo---------------------------------//    
  
  
  this.publicacionesServicio.filterFotoPublicacionId(id)
  .subscribe((data) => {
    this.archivos = data;
  })
 
  this.loading = false; 
  
  }


  sendUrlFotoModal(url:string){

    
    this.urlFotoModal ='';
    this.urlFotoModal= url;
   

    const sendUrlImage = this.sendUrlImage.nativeElement;
    sendUrlImage.click();

  }

  responder(id:any, emailuserFrom:string){

   const formData = {

    respuesta: this.registerRespuesta.value.respuesta,
    fecharespuesta:serverTimestamp(),
    id:id
   }

   this.publicacionesServicio.updatePregunta(formData)
   .then(resp =>{


    //mandamos la Notificacion al usuario
    const docNotify = {
      emailuser: emailuserFrom,
      message: this.currentUsuario.nombre,
      details: 'Respondio tu pregunta ',
      status: 'LN',
      urlfoto: this.urlFotoPrincipal,
      iddetails: this.idPublicacion,
      rutadetails: '/publication-details/view/' + this.idPublicacion,
      fecha:Timestamp.fromDate(new Date(Date.now()))
    }
    this.notificationService.Add(docNotify)
    .catch(error =>{
      console.log('sucedio un error '+ error);
    })

    this.respuestaForm.resetForm();
    this.toastr.success('La respuesta ha sido enviada', 'Mensaje');

   })

  }


  preguntar(e:boolean){

  

    const formData = {

      pregunta: this.registerPregunta.value.pregunta,
      emailuserTo:this.emailuserTo,
      emailuserFrom:this.currentUsuario.email,
      fechapregunta: serverTimestamp(),
      idpublicacion: this.idPublicacion,
      fecharespuesta:'',
      respuesta:'',
    }

    this.publicacionesServicio.AddPreguntas(formData)
    .then(resp =>{
  
  //mandamos la Notificacion al usuario
      const docNotify = {
        emailuser: this.emailuserTo,
        message: this.currentUsuario.nombre,
        details: 'Te ha preguntado sobre tu publicación',
        status: 'LN',
        urlfoto: this.urlFotoPrincipal,
        iddetails: this.idPublicacion,
        rutadetails: '/publication-details/view/' + this.idPublicacion,
        fecha:Timestamp.fromDate(new Date(Date.now()))
      }
      this.notificationService.Add(docNotify)
      .catch(error =>{
        console.log('sucedio un error '+ error);
      })

      this.preguntarForm.resetForm();
      this.toastr.success('La pregunta ha sido enviada', 'Mensaje');

      if(e){ 

        const botonPreguntar = this.botonPreguntar.nativeElement;
        botonPreguntar.click();
      }

    })
    .catch(error =>{

    })


    
  }

  searchFotoUrl(user:string){
 
 
    //-----------------------Fotos emailUser---------------------------------//    
    this.usuariosServicio.filterUsuario(user)
    .subscribe((data) => {
    
    for(const [key, value] of Object.entries(data)){
      
      this.urlFotoemailFrom = value.imageProfileUrl;
     
    }
  })

  }

  searchFotoUrlUserTo(user:string){
 
 
    //-----------------------Fotos emailUser---------------------------------//    
    this.usuariosServicio.filterUsuario(user)
    .subscribe((data) => {
    
    for(const [key, value] of Object.entries(data)){
      
      this.urlFotoemailTo = value.imageProfileUrl;
     
    }
  })

  }


  SearchDatosVendedor(emailVendedor:string){


    this.usuariosServicio.filterUsuario(emailVendedor).subscribe(usuario => {

      this.usuarios = usuario;

      for(const [key, value] of Object.entries(usuario)){

        this.DatosVendedor.direccion = value.direccion;
        this.DatosVendedor.alias = value.alias;
        this.DatosVendedor.documento = value.documento;
        this.DatosVendedor.documento = value.documento;
        this.DatosVendedor.nombre = value.nombre;
        this.DatosVendedor.email = value.email;
        this.DatosVendedor.telefono = value.telefono;
        this.DatosVendedor.id = value.id!;
        this.DatosVendedor.imageProfileUrl = value.imageProfileUrl;

      }

    });

  }

  obtenerDiasTranscurridos(fechaFin: string): number {

    const fechaObj = new Date(fechaFin.split('/').reverse().join('/'));
    const fechaSalida = new Date(fechaObj.getFullYear(), fechaObj.getMonth(), fechaObj.getDate()).toISOString().slice(0, 10);

    const fechaInicioObj = new Date();
    const fechaFinObj = new Date(fechaSalida);

    const unDia = 24 * 60 * 60 * 1000; // Cantidad de milisegundos en un día
    const diferenciaMs = Math.abs(fechaInicioObj.getTime() - fechaFinObj.getTime()); // Diferencia en milisegundos
    const diasTranscurridos = Math.round(diferenciaMs / unDia);
    return diasTranscurridos;
  }


  sendWhatsAppMessage(telefono:string) {

    const url = `https://api.whatsapp.com/send?phone=58${telefono}`;
    
    window.open(url, '_blank');
  
  }



}
