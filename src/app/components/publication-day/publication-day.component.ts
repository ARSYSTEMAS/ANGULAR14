import { Component } from '@angular/core';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { serverTimestamp } from 'firebase/firestore';
import { Timestamp } from '@angular/fire/firestore';



@Component({
  selector: 'app-publication-day',
  templateUrl: './publication-day.component.html',
  styleUrls: ['./publication-day.component.css']
})
export class PublicationDayComponent {

  formato: any;
  loading : boolean = false;
  Ispublicacion : Publicaciones[];
  IspublicacionCpy : Publicaciones[];

  constructor(
    private publicacionesServicio:PublicacionesServiceTsService,
    private authService: UserService,
    private usuariosServicio:UsuariosServiceTsService,
    private formatos:FormatosServiceTsService,
    private router: Router,
    private route: ActivatedRoute,
  
  ){
  
    this.formato = this.formatos;
  }
  
  
  ngOnInit() {


  //Publicacion
  this.publicacionesServicio.filterPublicacionGeneral()
  .subscribe((data) => {
  
    this.Ispublicacion = data;
    this.IspublicacionCpy = data;
    
  
    const formattedToday = Timestamp.fromDate(new Date(Date.now()))
 
    this.IspublicacionCpy = this.IspublicacionCpy.filter(v => this.formatos.formatearFecha(v.fechapublicacion) === this.formatos.formatearFecha(formattedToday));


  });
 
}//ngOnit


verPublicacion(id:string){

  
  window.open(`/publication-details/view/${id}`, '_blank');

 

 }
  
}
