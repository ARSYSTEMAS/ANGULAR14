import { Component } from '@angular/core';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-recentscar',
  templateUrl: './recentscar.component.html',
  styleUrls: ['./recentscar.component.css']
})
export class RecentscarComponent {

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

    this.IspublicacionCpy.sort((a, b) =>  new Date(this.formatos.formatearFechaUs(b.fechapublicacion)).getTime() - new Date(this.formatos.formatearFechaUs(a.fechapublicacion)).getTime());

    this.IspublicacionCpy = this.IspublicacionCpy.slice(0,3);

    });



 
  

}//ngOnit


verPublicacion(id:string){

  
  window.open(`/publication-details/view/${id}`, '_blank');

 

 }
  
}
