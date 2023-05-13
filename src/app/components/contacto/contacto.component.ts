import { Component, ViewChild } from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactoServiceTsService } from 'src/app/services/contacto.service';
import { Timestamp } from '@angular/fire/firestore';
import { NotificationService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  contactoForm: FormGroup;
  @ViewChild('ContactoForm') ContactoForm:NgForm;

  sendContacto: boolean = false;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private contacto:ContactoServiceTsService,
    
  ){

    this.contactoForm = this.fb.group({

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      motivo: ['',Validators.required],
      fecha: [],
      mensaje: ['',Validators.required]
    })


  }


  enviar(){
    this.sendContacto = true;
  
      const docDataAutosUsados = {
        emailuser:'autosusadosve@gmail.com',
        message:'Han enviado 1 contacto',
        details: this.contactoForm.value.correo,
        status: 'LN',
        urlfoto:'nulo',
        rutadetails: 'nulo',
        iddetails: 'nulo',
        fecha:Timestamp.fromDate(new Date(Date.now()))
      }

      
      this.notificationService.Add(docDataAutosUsados);

    const docData = {
      nombre: this.contactoForm.value.nombre,
      apellido: this.contactoForm.value.apellido,
      telefono: this.contactoForm.value.telefono,
      correo: this.contactoForm.value.correo,
      motivo: this.contactoForm.value.motivo,
      fecha: serverTimestamp(),
      mensaje:this.contactoForm.value.mensaje
      }
   
      this.contacto.Add(docData)

     


      .then(resp => {

        this.toastr.success('Mensaje enviado Correctamente','Envio de Formulario');
        this.ContactoForm.resetForm();
      })
      .catch(error =>{

       this.toastr.error('Error al enviar mensaje '+ error,'Envio de Formulario');
      })
  }

}
