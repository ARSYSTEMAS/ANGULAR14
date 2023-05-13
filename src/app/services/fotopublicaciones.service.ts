import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import fotoPublicaciones from '../interfaces/fotopublicaciones.interface';

@Injectable({
  providedIn: 'root'
})
export class fotoPublicacionesServiceTsService {

  constructor(private firestore: Firestore) { }

  Add(fotoPublicaciones:fotoPublicaciones){

    const fotoPublicacionesRef= collection(this.firestore,'fotopublicaciones',);
    return addDoc(fotoPublicacionesRef, fotoPublicaciones);
  }

}
