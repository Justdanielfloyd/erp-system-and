// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      name: string;
      FUSUARIS_APPID: number;
      Nom: string;
      Codi_Empleat: string;
      tipus: string;
      IDFEMPRESA: number;
      NOM_BBDD: string;
      Token: string;
      codiSerie: string;
      Codi_Venedor: string;
      Codi_Client: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    user: any; //FIXME
  }
}
