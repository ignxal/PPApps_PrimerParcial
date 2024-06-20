import { ICollection } from "../interfaces/iCollection";
import { Gasto } from "./gasto";

export class Gastos implements ICollection{
    constructor(public id:string,
                public email:string,
                public ingresos:number,
                public margen:number,
                public movimientos:Gasto[] = [],
                ){}
}
