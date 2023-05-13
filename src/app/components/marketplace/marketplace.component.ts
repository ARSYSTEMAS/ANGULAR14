import { Component } from '@angular/core';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';
import  Publicaciones  from 'src/app/interfaces/publicaciones.interface';
import { UserService } from 'src/app/services/users.service';
import { UsuariosServiceTsService } from 'src/app/services/usuarios.service';
import Usuarios from 'src/app/interfaces/usuarios.interface';
import { FormatosServiceTsService } from 'src/app/services/formatos.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent {

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
isLoggedIn:boolean = false;
LoggedInUser: string;
p: number = 1;
Loadingpublicaciones:boolean=false;
LoadingListModelos:boolean=false;
LoadingListMarca:boolean=false;
LoadingListAno:boolean=false;
LoadingListUbicacion:boolean=false;
usuarios: Usuarios[];
nroPagination:number = 9;


modelosVehiculos:any[]=[];
listModelosVehiculos:any[]=[];
conteoModelos:any = {};
modelosSeleccionadosVehiculos: string[] = [];



marcasVehiculos:any[]=[];
listMarcasVehiculos:any[]=[];
conteoMarcas:any = {};
marcasSeleccionadosVehiculos: string[] = [];

anosVehiculos:any[]=[];
listAnosVehiculos:any[]=[];
conteoAnos:any = {};
anosSeleccionadosVehiculos: string[] = [];

ubicacionVehiculos:any[]=[];
listUbicacionVehiculos:any[]=[];
conteoUbicacion:any = {};
ubicacionSeleccionadosVehiculos: string[] = [];

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

  this.Loadingpublicaciones = true;  
  this.LoadingListModelos = true;
  this.LoadingListMarca = true;
  this.LoadingListAno = true;
  this.LoadingListUbicacion = true;
  
  this.authService.isLoggedIn();
  this.authService.getAuth().subscribe( auth =>{

  //Publicacion
  this.publicacionesServicio.filterPublicacionGeneral()
  .subscribe((data) => {
  
    this.Ispublicacion = data;
    this.IspublicacionCpy = data;

    
    for(const [key,value] of Object.entries(this.Ispublicacion)){
    
      //LISTA MODELOS DE VEHICULOS
      this.modelosVehiculos.push(value.modelo);
      this.listModelosVehiculos=  [...new Set(this.modelosVehiculos)];
      this.conteoModelos = this.obtenerConteoModelos(this.modelosVehiculos);

        //LISTA MARCAS DE VEHICULOS
      this.marcasVehiculos.push(value.marca);
      this.listMarcasVehiculos=  [...new Set(this.marcasVehiculos)];
      this.conteoMarcas = this.obtenerConteoMarcas(this.marcasVehiculos);

        //LISTA ANOS VEHICULOS
      this.anosVehiculos.push(value.ano);
      this.listAnosVehiculos=  [...new Set(this.anosVehiculos)];
      this.conteoAnos = this.obtenerConteoAnos(this.anosVehiculos);

        //LISTA UBICACION DE VEHICULOS
      this.ubicacionVehiculos.push(value.ubicacion);
      this.listUbicacionVehiculos=  [...new Set(this.ubicacionVehiculos)];
      this.conteoUbicacion = this.obtenerConteoUbicacion(this.ubicacionVehiculos);

    }
    
    this.Loadingpublicaciones = false;
    this.LoadingListModelos = false;
    this.LoadingListMarca = false;
    this.LoadingListAno = false;
    this.LoadingListUbicacion = false;
    
  });

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

    for(const [key,value] of Object.entries(this.Ispublicacion)){
        
          //LISTA MODELOS DE VEHICULOS
          this.modelosVehiculos.push(value.modelo);
          this.listModelosVehiculos=  [...new Set(this.modelosVehiculos)];
          this.conteoModelos = this.obtenerConteoModelos(this.modelosVehiculos);
  
           //LISTA MARCAS DE VEHICULOS
          this.marcasVehiculos.push(value.marca);
          this.listMarcasVehiculos=  [...new Set(this.marcasVehiculos)];
          this.conteoMarcas = this.obtenerConteoMarcas(this.marcasVehiculos);
  
            //LISTA ANOS VEHICULOS
          this.anosVehiculos.push(value.ano);
          this.listAnosVehiculos=  [...new Set(this.anosVehiculos)];
          this.conteoAnos = this.obtenerConteoAnos(this.anosVehiculos);
  
            //LISTA UBICACION DE VEHICULOS
          this.ubicacionVehiculos.push(value.ubicacion);
          this.listUbicacionVehiculos=  [...new Set(this.ubicacionVehiculos)];
          this.conteoUbicacion = this.obtenerConteoUbicacion(this.ubicacionVehiculos);
  
        }
        
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

  

  this.IspublicacionCpy.sort((a, b) =>  new Date(this.formatos.formatearFechaUs(b.fechapublicacion)).getTime() - new Date(this.formatos.formatearFechaUs(a.fechapublicacion)).getTime());

}


filtrarPorModelos(modelo:string,event:Event){

  if((event.target as HTMLInputElement).checked) {
    
    this.modelosSeleccionadosVehiculos.push(modelo);
    
  }else{

    const index = this.modelosSeleccionadosVehiculos.indexOf(modelo);
    this.modelosSeleccionadosVehiculos.splice(index, 1);


  }

  
 if(this.modelosSeleccionadosVehiculos.length > 0){

      const filteredPublicacion = this.Ispublicacion.filter(publicacion => this.modelosSeleccionadosVehiculos.includes(publicacion.modelo) &&
      (this.marcasSeleccionadosVehiculos?.length > 0 ? this.marcasSeleccionadosVehiculos.includes(publicacion.marca) : true) &&
      (this.anosSeleccionadosVehiculos?.length > 0 ? this.anosSeleccionadosVehiculos.includes(publicacion.ano) : true) &&
       (this.ubicacionSeleccionadosVehiculos?.length > 0 ? this.ubicacionSeleccionadosVehiculos.includes(publicacion.ubicacion) : true) 

      
      );

      this.IspublicacionCpy = filteredPublicacion;
  }else{
   
      this.IspublicacionCpy = this.Ispublicacion;
  }
}




filtrarPorMarcas(marca:string,event:Event){

  if((event.target as HTMLInputElement).checked) {
    
    this.marcasSeleccionadosVehiculos.push(marca);
    
  }else{

    const index = this.marcasSeleccionadosVehiculos.indexOf(marca);
    this.marcasSeleccionadosVehiculos.splice(index, 1);

  }

  
  if(this.marcasSeleccionadosVehiculos.length > 0){

     const filteredPublicacion = this.Ispublicacion.filter(publicacion => this.marcasSeleccionadosVehiculos.includes(publicacion.marca)&&
      (this.modelosSeleccionadosVehiculos?.length > 0 ? this.modelosSeleccionadosVehiculos.includes(publicacion.modelo) : true) &&
      (this.anosSeleccionadosVehiculos?.length > 0 ? this.anosSeleccionadosVehiculos.includes(publicacion.ano) : true) &&
      (this.ubicacionSeleccionadosVehiculos?.length > 0 ? this.ubicacionSeleccionadosVehiculos.includes(publicacion.ubicacion) : true)
       
       ); 

      this.IspublicacionCpy = filteredPublicacion;
  }else{

      this.IspublicacionCpy = this.Ispublicacion;
  }

  
}


filtrarPorAnos(ano:string,event:Event){

  if((event.target as HTMLInputElement).checked) {
    
    this.anosSeleccionadosVehiculos.push(ano);
    
  }else{

    const index = this.anosSeleccionadosVehiculos.indexOf(ano);
    this.anosSeleccionadosVehiculos.splice(index, 1);

  }

  if(this.anosSeleccionadosVehiculos.length > 0){

     const filteredPublicacion = this.Ispublicacion.filter(publicacion => this.anosSeleccionadosVehiculos.includes(publicacion.ano)&&
      (this.marcasSeleccionadosVehiculos?.length > 0 ? this.marcasSeleccionadosVehiculos.includes(publicacion.marca) : true) &&
      (this.modelosSeleccionadosVehiculos?.length > 0 ? this.modelosSeleccionadosVehiculos.includes(publicacion.modelo) : true) &&
       (this.ubicacionSeleccionadosVehiculos?.length > 0 ? this.ubicacionSeleccionadosVehiculos.includes(publicacion.ubicacion) : true) 
     
     );

      this.IspublicacionCpy = filteredPublicacion;
  }else{

      this.IspublicacionCpy = this.Ispublicacion;
  }
}


filtrarPorUbicacion(ubica:string,event:Event){

  if((event.target as HTMLInputElement).checked) {
    
    this.ubicacionSeleccionadosVehiculos.push(ubica);
    
  }else{

    const index = this.ubicacionSeleccionadosVehiculos.indexOf(ubica);
    this.ubicacionSeleccionadosVehiculos.splice(index, 1);

  }

  if(this.ubicacionSeleccionadosVehiculos.length > 0){

     const filteredPublicacion = this.Ispublicacion.filter(publicacion => this.ubicacionSeleccionadosVehiculos.includes(publicacion.ubicacion)&&
      (this.marcasSeleccionadosVehiculos?.length > 0 ? this.marcasSeleccionadosVehiculos.includes(publicacion.marca) : true) &&
      (this.anosSeleccionadosVehiculos?.length > 0 ? this.anosSeleccionadosVehiculos.includes(publicacion.ano) : true) &&
       (this.modelosSeleccionadosVehiculos?.length > 0 ? this.modelosSeleccionadosVehiculos.includes(publicacion.modelo) : true) 
     
     );

      this.IspublicacionCpy = filteredPublicacion;
  }else{

      this.IspublicacionCpy = this.Ispublicacion;
  }
}

obtenerConteoModelos(modelo:any[]) {
    let conteo: any = {};
    modelo.forEach(modelos => {
      if (!conteo[modelos]) {
        conteo[modelos] = 1;
      } else {
        conteo[modelos]++;
      }
    });
    return conteo;
  }

  obtenerConteoMarcas(marca:any[]) {
    let conteo: any = {};
    marca.forEach(marcas => {
      if (!conteo[marcas]) {
        conteo[marcas] = 1;
      } else {
        conteo[marcas]++;
      }
    });
    return conteo;
  }

  obtenerConteoAnos(ano:any[]) {
    let conteo: any = {};
    ano.forEach(anos => {
      if (!conteo[anos]) {
        conteo[anos] = 1;
      } else {
        conteo[anos]++;
      }
    });
    return conteo;
  }

  obtenerConteoUbicacion(ubica:any[]) {
    let conteo: any = {};
    ubica.forEach(ubicacion => {
      if (!conteo[ubicacion]) {
        conteo[ubicacion] = 1;
      } else {
        conteo[ubicacion]++;
      }
    });
    return conteo;
  }


  mostrarPage(n:number){

    this.nroPagination = n;


  }
}
