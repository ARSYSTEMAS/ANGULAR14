import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';

import { addDoc, collection, Firestore, orderBy, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';

import { Notificacion } from '../interfaces/notificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: any[] = [];
  public ListNotification: any[] = [];
  public notificationsChanged = new Subject<string[]>();
  public notification$ = this.notificationsChanged.asObservable(); //observable
  
  constructor(private firestore: Firestore) { }



  addNotification(email:string) {

    this.filterNotifications(email).subscribe(listnotifications => {
  
      this.ListNotification = listnotifications;

      for(let i=0; i<  this.ListNotification.length; i++){
        

            const date = new Date(this.ListNotification[i].fecha.seconds * 1000 + this.ListNotification[i].fecha.nanoseconds / 1000000);

            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
             // fecha:this.ListNotification[i].fecha.toDate().toLocaleDateString('en-US'),
            const notificacion: Notificacion = {
              id:this.ListNotification[i].id,
              details: this.ListNotification[i].details,
              emailuser: email,            
              fecha:formattedDate,
              message:this.ListNotification[i].message,
              status:this.ListNotification[i].status,
              urlfoto:this.ListNotification[i].urlfoto,
              rutadetails:this.ListNotification[i].rutadetails,
              iddetails: this.ListNotification[i].iddetails,
            };

            this.notifications.push(notificacion);
            this.notificationsChanged.next([...this.notifications]);
            
      }
      this.notifications=[];
     
  });



  }

  getNotifications() {
    return [...this.notifications];
  }

//----------------------------------------------------------------------
  Add(notificaciones:Notificacion){
  const NotificacionesRef= collection(this.firestore,'notifications',);
  return addDoc(NotificacionesRef, notificaciones);
  }


  filterNotifications(email:string){
   
    const notificacionRef = query(collection(this.firestore,'notifications'), where("emailuser", "==", email));
    //where("status", "==", 'LN'), where("fecha", "<=", serverTimestamp()));

    return collectionData(notificacionRef, {idField: 'id'}) as Observable<Notificacion[]>;

  }

  updateFieldNotificacion(id: string, valor: string){
  
    const notificaciondocRef = doc(this.firestore,`notifications/${id}`);
    return updateDoc(notificaciondocRef, {status:valor});
  }
  

  deleteNotificacion(id:string){
    const notificaciondocRef = doc(this.firestore,`notifications/${id}`);
    return deleteDoc(notificaciondocRef);
  }

 

  async deleteNotificacionId(idPublicacion: string) {
    const queryRef = query(collection(this.firestore, 'notifications'), where('iddetails', '==', idPublicacion));
    const notificacionDocs = await getDocs(queryRef);
    notificacionDocs.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }
}
