import { Profiles } from "src/app/enums/profiles";
import { ICollection } from "src/app/interfaces/iCollection";

export class Person implements ICollection {
  id: string;
  name: string;
  lastName: string;
  // dni: number | null;
  // photo: string;
  email: string;
  profile?: string;
  token:string;

  constructor(id: string = "",
    name: string = "",
    lastName: string = "",
    // dni: number | null = null,
    // photo: string = "",
    email: string = "",
    profile: string = Profiles.Anonimo) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    // this.dni = dni;
    // this.photo = photo;
    this.email = email;
    this.profile = profile;
    this.token = "";
  }
}
