import { Component,OnInit } from '@angular/core';
import { ScriptService } from 'src/app/services/script.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { MarcaModeloService } from 'src/app/services/marcaModelo.service';
import Publicaciones from 'src/app/interfaces/publicaciones.interface';
import { PublicacionesServiceTsService } from 'src/app/services/publicaciones.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isLoggedIn:boolean;
  LoggedInUser: any;
  public subscriber: Subscription;
  isHome:boolean;
  isSell:boolean;
  isProfile:boolean;
  isLogin:boolean;
  isRegister:boolean;
  isMarketPlace:boolean;
  isAyuda:boolean;
  Ispublicacion : Publicaciones[];


  marcasVehiculos:any[]=[];
  listMarcasVehiculos:any[]=[];
 


  constructor(
    private authService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private scriptCarousel: ScriptService,
    private marcaModelo:MarcaModeloService,
    private publicacionesServicio:PublicacionesServiceTsService,
  ){


    
  }

  ngOnInit(){

     //Publicacion
     this.publicacionesServicio.filterPublicacionGeneral()
     .subscribe((data) => {
    
       this.Ispublicacion = data;
       
       for(const [key,value] of Object.entries(this.Ispublicacion)){
       
          //LISTA MARCAS DE VEHICULOS
         this.marcasVehiculos.push(value.marca);
         this.listMarcasVehiculos=  [...new Set(this.marcasVehiculos)];
       }
      
    });



    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event:any) => {
      
     
      switch(event['url']) {
        case '/home':
          this.isHome = true;
          this.isProfile = false;
          this.isSell = false;
          this.isLogin = false;
          this.isRegister = false;
          this.isMarketPlace = false;
          this.isAyuda = false;
          break;
        case '/profile':
          this.isProfile = true;
          this.isHome = false;
          this.isSell = false;
          this.isLogin = false;
          this.isRegister = false;
          this.isMarketPlace = false;
          this.isAyuda = false;
          break;
        case '/sell':
          this.isSell = true;
          this.isHome = false;
          this.isProfile = false;
          this.isLogin = false;
          this.isRegister = false;
          this.isMarketPlace = false;
          this.isAyuda = false;
          break;
        case '/login':
          this.isLogin = true;
          this.isHome = false;
          this.isProfile = false;
          this.isSell = false;
          this.isRegister = false;
          this.isMarketPlace = false;
          this.isAyuda = false;
          break;
        case '/register':
          this.isRegister = true;
          this.isLogin = false;
          this.isHome = false;
          this.isProfile = false;
          this.isSell = false;
          this.isMarketPlace = false;
          this.isAyuda = false;
          break;
       case '/marketplace':
          this.isMarketPlace = true;
          this.isRegister = false;
          this.isLogin = false;
          this.isHome = false;
          this.isProfile = false;
          this.isSell = false;
          this.isAyuda = false;
          break;
        case '/ayuda':
            this.isAyuda = true;
            this.isMarketPlace = false;
            this.isRegister = false;
            this.isLogin = false;
            this.isHome = false;
            this.isProfile = false;
            this.isSell = false;
            break;
        default:
          break;
      }


    });

    this.authService.getAuth().subscribe( auth =>{

      if (auth){

        this.isLoggedIn = true;
        this.LoggedInUser = auth.email;
      
      }else{

        this.isLoggedIn = false;
      }
    })

    

  }

  search(marca:string){

    

    const url = `/marketplace-search/marca/${marca}`;
    
    window.open(url, '_blank');

  }

  ngOnDestroy(){

  //  this.scriptCarousel.removeScript('my-script');
  this.subscriber?.unsubscribe();
  }

}
