export interface Credential{
    email:string,
    password:string
}

export interface UserData{
    name:string,
    email:string,
    role:string,
    password:string
}


export interface changePassword{
    new:string,
    current:string
}