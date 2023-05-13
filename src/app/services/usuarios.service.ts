import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Usuarios from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServiceTsService {

  constructor(private firestore: Firestore) { }

  Add(usuario:Usuarios){

    const usuarioRef= collection(this.firestore,'Usuarios',);
    return addDoc(usuarioRef, usuario);
  }

  show(): Observable<Usuarios[]>{
    const usuarioRef= collection(this.firestore,'Usuarios');
    return collectionData(usuarioRef, {idField: 'id'}) as Observable<Usuarios[]>;

  }

  delete(usuario:Usuarios){
    const usuariodocRef = doc(this.firestore,`Usuarios/${usuario.id}`);
    return deleteDoc(usuariodocRef);
  }

  filter(id:string){
    const usuariodocRef = doc(this.firestore,`Usuarios/${id}`);
    return docData(usuariodocRef, { idField: 'id' }) as Observable<Usuarios[]>;

   
  }


  filterUsuario(email:string){
   
    const usuariodocRef = query(collection(this.firestore,'Usuarios'),where("email", "==", email));
    return collectionData(usuariodocRef, {idField: 'id'}) as Observable<Usuarios[]>;

  }

 
  update(usuario: Usuarios) {

    
    const usuariodocRef = doc(this.firestore,`Usuarios/${usuario.id}`);
    return updateDoc(usuariodocRef, { ...usuario });
  }

  updateFilerUsuario(usuario: Usuarios,imageProfileUrl:string){

  
  }

}
