import { Component } from '@angular/core';

@Component({
  selector: 'app-backtotop',
  templateUrl: './backtotop.component.html',
  styleUrls: ['./backtotop.component.css']
})
export class BacktotopComponent {

  constructor(){}

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
