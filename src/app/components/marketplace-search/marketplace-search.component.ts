import { Component } from '@angular/core';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-marketplace-search',
  templateUrl: './marketplace-search.component.html',
  styleUrls: ['./marketplace-search.component.css']
})
export class MarketplaceSearchComponent {

  Search: string = this.route.snapshot.params['search'];
  categoria: string = this.route.snapshot.params['categoria'];


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

formato: any;
loading : boolean = false;
Ispublicacion : Publicaciones[];
IspublicacionCpy : Publicaciones[];
isLoggedIn:boolean;
LoggedInUser: string;
p: number = 1;
Loadingpublicaciones:boolean=false;

usuarios: Usuarios[];
nroPagination:number = 1000;



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

  if(this.categoria == 'marca')  {
    this.publicacionesServicio.filterPublicacionGeneralSearchMarca(this.Search)
    .subscribe((data) => {
  
      this.Ispublicacion = data;
      this.IspublicacionCpy = data;   
      this.Loadingpublicaciones = false;   
    });
  }else{

    this.publicacionesServicio.filterPublicacionGeneralSearchModelo(this.Search)
    .subscribe((data) => {
  
      this.Ispublicacion = data;
      this.IspublicacionCpy = data;      
      this.Loadingpublicaciones = false;
    });

}

  this.Loadingpublicaciones = true;  
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


  verPublicacion(id:string){

  

   window.open(`/publication-details/view/${id}`, '_blank');

  

  }


ordenarListadoMayorPrecio(){


    this.IspublicacionCpy.sort((a, b) => b.precio - a.precio);
  

}

ordenarListadoMenorPrecio(){


    this.IspublicacionCpy.sort((a, b) => a.precio - b.precio);
  

}


ordenarListadoMasReciente(){

  this.IspublicacionCpy.sort((a, b) =>  new Date(this.formatos.formatearFecha(b.fechapublicacion)).getTime() - new Date(this.formatos.formatearFecha(a.fechapublicacion)).getTime());

}



  mostrarPage(n:number){

    this.nroPagination = n;


  }
}
