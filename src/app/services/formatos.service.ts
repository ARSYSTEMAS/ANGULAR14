import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FormatosServiceTsService {

constructor(){}


formatearValor(valor: number, tipoMoneda: string): string {
  const ffIntl = tipoMoneda === 'Bolivares' ? 'es-VE' : 'en-US';
  const currency = tipoMoneda === 'Bolivares' ? 'VES' : 'USD';

  const formatter = new Intl.NumberFormat(ffIntl, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });

  return formatter.format(valor);
}

formatoNumerico(valor:number) {
  const formatter = new Intl.NumberFormat('es-VE');
  return formatter.format(valor);
}


generarPassword(longitud:number) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var contraseña   = "";
  for (var i = 0; i < longitud; i++) {
    contraseña+= caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contraseña;
}
/*
formatearFecha(fecha:any):string{

  const date = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);

  let day = date.getDate();

  let month = date.getMonth() + 1;


  // Agregar un cero si el día o el mes son menores a 10
 // day = day < 10 ? "0" + day : day;
 // month = month < 10 ? "0" + month : month;

  // Crear la fecha con el formato deseado
  const formattedDate = day + "/" + month + "/" + fecha.getFullYear();

  //const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return formattedDate;
}*/


formatearFecha(fecha: any): string {
  const date = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const formattedDate = `${day}/${month}/${date.getFullYear()}`;

  return formattedDate;
}

formatearFechaUs(fecha: any): string {
  const date = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const formattedDate = `${date.getFullYear()}-${month}-${day}`;

  return formattedDate;
}

}