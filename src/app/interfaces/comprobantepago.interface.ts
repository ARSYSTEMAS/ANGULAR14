export interface ComprobantePago{
    id?:string,
    idpublicacion: string;
    emailuser: string;
    fecha:any;
    urlcomprobante:string;
    estatuscomprobante:string; // PR = 'PENDIENTE POR REVISAR' - RR = 'REVISADO Y RECHAZADO' - RA = 'REVISADO Y APROBADO'
};