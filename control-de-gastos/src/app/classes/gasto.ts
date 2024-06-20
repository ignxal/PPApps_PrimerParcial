import { Timestamp } from "firebase/firestore";

export interface Gasto {
    fecha: Timestamp,
    monto: number,
    categoria: string
}
