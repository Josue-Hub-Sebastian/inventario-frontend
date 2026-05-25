export interface Equipo {
    id?: number;
    
    codigoPatrimonial: string;
    tipoEquipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    estadoEquipo: string;
    ubicacion: string;

    usuarioAsignado?: string;

    
}


