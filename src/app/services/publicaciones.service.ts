import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, collectionData, doc, deleteDoc,  updateDoc, docData, where, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import  Publicaciones  from '../interfaces/publicaciones.interface';

import  Preguntas  from '../interfaces/preguntas.interface';

import FotoPublicaciones from '../interfaces/fotopublicaciones.interface';

import { ComprobantePago } from '../interfaces/comprobantepago.interface';

import { getStorage, ref, deleteObject } from "firebase/storage";

import { orderBy, limit } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class PublicacionesServiceTsService {


  constructor(private firestore: Firestore) { }

  Add(publicaciones:Publicaciones){

    const publicacionesRef= collection(this.firestore,'publicaciones',);
    return addDoc(publicacionesRef, publicaciones);
  }

  show(): Observable<Publicaciones[]>{
    const publicacionesRef= collection(this.firestore,'publicaciones');
    return collectionData(publicacionesRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

  delete(publicaciones:Publicaciones){
    const publicacionesdocRef = doc(this.firestore,`publicaciones/${publicaciones.id}`);
    return deleteDoc(publicacionesdocRef);
  }


  deletePublicacion(id:string){
    const publicacionesdocRef = doc(this.firestore,`publicaciones/${id}`);
    return deleteDoc(publicacionesdocRef);
  }


  //---------------------------------FILTROS------------------------------------//
  filterPublicacionId(id:string){
    const publicacionesdocRef = doc(this.firestore,`publicaciones/${id}`);
    return docData(publicacionesdocRef, { idField: 'id' }) as Observable<Publicaciones[]>;

   
  }

  

  filterPublicacionUsuario(email:string){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'), where("emailuser", "==", email));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

  filterPublicacionUsuarioId(id:string, email:string){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'), where("emailuser", "==", email), where("idpublicacion", "==", id));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }


  filterPublicacion(id:string){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'),where("idpublicacion", "==", id));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

  filterPublicacionGeneral(){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'),where("estatuspublicacion", "==", 'A'));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

    filterPublicacionGeneralSearchMarca(marca:string){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'),where("estatuspublicacion", "==", 'A'),where("marca", "==", marca));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

  filterPublicacionGeneralSearchModelo(modelo:string){
   
    const publicacionesdocRef = query(collection(this.firestore,'publicaciones'),where("estatuspublicacion", "==", 'A'),where("modelo", "==", modelo));
    return collectionData(publicacionesdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }
//----------------------------------ACTUALIZACIONES------------------------------//
  update(publicaciones: Publicaciones) {

    const publicacionesdocRef = doc(this.firestore,`publicaciones/${publicaciones.id}`);
    return updateDoc(publicacionesdocRef, { ...publicaciones });
  }


 updateField(id: string,  valor: string){
  
  const publicacionesdocRef = doc(this.firestore,`publicaciones/${id}`);
  return updateDoc(publicacionesdocRef, {fotoprincipal:valor,idpublicacion:id});
}

updateEstatus(id: string,  valor: string){
  
  const publicacionesdocRef = doc(this.firestore,`publicaciones/${id}`);
  return updateDoc(publicacionesdocRef, {estatuspublicacion:valor});
}



updatePublicacion(data:any){

  const publicacionesdocRef = doc(this.firestore,`publicaciones/${data.idpublicacion}`);
  return updateDoc(publicacionesdocRef, 
    {
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      km: data.km,
      transmision: data.transmision,
      unicodueno: data.unicodueno,
      extra: data.extra,
      fallas:data.fallas,
      aceptascambio:data.aceptascambio,
      precio:data.precio,
      tipomoneda:data.tipomoneda,
      ubicacion:data.ubicacion    
    });
}





//-------------------FOTO PUBLICACIONES---------------------//
  filterFotoPublicacionUsuarioId(id:string, email:string){
   
    const fotopublicacionesdocRef = query(collection(this.firestore,'fotopublicaciones'), where("emailuser", "==", email), where("idpublicacion", "==", id));
    return collectionData(fotopublicacionesdocRef, {idField: 'id'}) as Observable<FotoPublicaciones[]>;

  }

  filterFotoPublicacionId(id:string){
   
    const fotopublicacionesdocRef = query(collection(this.firestore,'fotopublicaciones'),where("idpublicacion", "==", id));
    return collectionData(fotopublicacionesdocRef, {idField: 'id'}) as Observable<FotoPublicaciones[]>;

  }


  deleteFotoPublicaciones(id:string){
    const publicacionesdocRef = doc(this.firestore,`fotopublicaciones/${id}`);
    return deleteDoc(publicacionesdocRef);
  }



  async deleteFotoIdPublicacion(idPublicacion: string) {
    const queryRef = query(collection(this.firestore, 'fotopublicaciones'), where('idpublicacion', '==', idPublicacion));
    const publicacionesDocs = await getDocs(queryRef);
    publicacionesDocs.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }

  deletefotoStorage(refimage:String){

      const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, `${refimage}`);

    // Delete the file
    deleteObject(desertRef).then(() => {
      return true;      
    }).catch((error) => {
      return false;
    });
    
      }


//-----------------------------------COMPROBANTES--------------------------------
  AddComprobante(comprobante:ComprobantePago){

        const comprobanteRef= collection(this.firestore,'comprobantepago');
        return addDoc(comprobanteRef, comprobante);
  }

 
  async deleteComprobante(email: string, id: string) {
    const comprobantesRef = collection(this.firestore, 'comprobantepago');
    const queryRef = query(comprobantesRef, where('emailuser', '==', email), where('idpublicacion', '==', id));
    const querySnapshot = await getDocs(queryRef);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }


  filterFacturas(email:string){
   
    const facturasdocRef = query(collection(this.firestore,'publicaciones'), where("emailuser", "==", email));
    return collectionData(facturasdocRef, {idField: 'id'}) as Observable<Publicaciones[]>;

  }

  filterComprobante(id:string){
   
    const comprobantedocRef = query(collection(this.firestore,'comprobantepago'),where("idpublicacion", "==", id));
    return collectionData(comprobantedocRef, {idField: 'id'}) as Observable<ComprobantePago[]>;

  }

  
//-----------------------------------PREGUNTAS--------------------------------
AddPreguntas(pregunta:Preguntas){

  const preguntaRef= collection(this.firestore,'preguntas');
  return addDoc(preguntaRef, pregunta);
}


filterPreguntas(id:string){
   
  const preguntasdocRef = query(collection(this.firestore,'preguntas'),where("idpublicacion", "==", id));
  return collectionData(preguntasdocRef, {idField: 'id'}) as Observable<Preguntas[]>;

}


updatePregunta(data:any){
  
  const preguntadocRef = doc(this.firestore,`preguntas/${data.id}`);
  return updateDoc(preguntadocRef, 
    {
      respuesta: data.respuesta,
      fecharespuesta: data.fecharespuesta
    });
}


async deletePreguntasId(idPublicacion: string) {
  const queryRef = query(collection(this.firestore, 'preguntas'), where('idpublicacion', '==', idPublicacion));
  const preguntasDocs = await getDocs(queryRef);
  preguntasDocs.forEach((doc) => {
    deleteDoc(doc.ref);
  });
}

}
