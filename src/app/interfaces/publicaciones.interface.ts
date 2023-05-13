export default interface Publicaciones{
    id?:string;
    marca: string;
    modelo: string;
    ano: string;
    km: number;
    transmision: string;
    unicodueno: string;
    extra:string;
    fallas:string;
    aceptascambio:string;
    precio:number;
    tipomoneda:string;
    fotoprincipal:string;
    idpublicacion:string;
    fechapublicacion:any;
    ubicacion:string;
    estatuspublicacion:string; //P= PENDIENTE POR PAGO - PA= PAUSADA - A= ACTIVA - PR= COMPROBANTE POR REVISAR
    emailuser:string;

}