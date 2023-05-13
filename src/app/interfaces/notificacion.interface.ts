export interface Notificacion {
    id?:string,
    details: string;
    emailuser: string;
    fecha:any;
    message:string;
    status:string; // L= leido LN = No leido
    urlfoto:string;
    rutadetails:string; // la ruta de la vista si tiene
    iddetails:string;

};