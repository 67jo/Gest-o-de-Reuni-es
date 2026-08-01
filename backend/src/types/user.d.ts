

interface UserType {
    email:string;
    name:string;
    password:string
}

type RegisterData = {
    data:UserType,
    password:string
}