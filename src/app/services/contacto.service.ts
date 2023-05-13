import { Injectable } from '@angular/core';
import  Contacto  from '../interfaces/contacto.interface';
import { addDoc, collection, Firestore, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class ContactoServiceTsService {

constructor(private firestore: Firestore){}

Add(contacto:Contacto){

    const contactoRef= collection(this.firestore,'contacto',);
    return addDoc(contactoRef, contacto);
  }

}