import { ICollection } from "src/app/interfaces/iCollection";
import { Person } from "./person";

export class Customer extends Person implements ICollection {

    // pending: string;
    password: string;

    constructor(id: string,
        name: string,
        lastName: string,
        // dni: number | null,
        // photo: string,
        email: string,
        profile: string,        
        password: string) {
        super(id,
            name,
            lastName,
            //dni,
            //photo, 
            email, profile);
        // this.pending = pending;
        this.password = password;
    }
}
