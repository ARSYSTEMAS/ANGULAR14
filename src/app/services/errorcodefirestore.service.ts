import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ErrorcodefirestoreService {

  constructor(private firestore: Firestore) { }


  firebaseError(code:string){

    switch(code){

      case 'ABORTED':
        return 'La operación se canceló';
      case 'ALREADY_EXISTS':
        return 'Los datos que intenta registrar ya esxiste en la Bases de datos';
      case 'CANCELLED':
        return 'La operación fue cancelada';
      case 'DEADLINE_EXCEEDED':
        return 'El plazo expiró antes de que pudiera completarse la operación.';
      case 'FAILED_PRECONDITION':
        return 'La operación fue rechazada porque el sistema no se encuentra en el estado requerido para la ejecución de la operación.';
      case 'INTERNAL':
        return 'Errores internos.';
      case 'NOT_FOUND':
        return 'No se encontró algún documento solicitado.'; 
      case 'PERMISSION_DENIED':
        return 'No tiene permiso para ejecutar la operación especificada.';            
      case 'UNAUTHENTICATED':
        return 'La solicitud no tiene credenciales de autenticación válidas para la operación.'; 
      case 'UNAVAILABLE':
        return 'El servicio no está disponible actualmente.'; 
      case 'UNKNOWN':
        return 'Error desconocido o un error de un dominio de error diferente.';
      default:
        return 'Error desconocido y/o conexion a internet. Actualize la pagina'; 
    }

}

}
