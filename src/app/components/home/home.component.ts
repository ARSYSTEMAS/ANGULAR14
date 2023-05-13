import { Component } from '@angular/core';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  

  constructor( private authService: UserService){}

  ngOnInit(){

    this.authService.getAuth().subscribe( auth =>{//valida si esta logeado

      if (auth){ //esta logeado. 

        this.authService.isLoggedIn();
        
      }
    })

    

  }

}
