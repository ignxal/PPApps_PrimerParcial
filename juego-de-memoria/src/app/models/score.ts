import { Timestamp } from "firebase/firestore";
import { ICollection } from "../interfaces/iCollection";

export class Score implements ICollection {

    constructor(public id: string,
        public email: string,
        public score: number,
        public dificultad: 'facil' | 'medio' | 'dificil',
        public date: Timestamp) { }
}
