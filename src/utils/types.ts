import { Role } from "src/enum"

export class CreateUserParams {
   name: string
   email: string
   password: string
}

export type CurrentUser = {
   id:number,
   role:Role
}
