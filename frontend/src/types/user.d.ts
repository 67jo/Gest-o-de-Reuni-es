
interface UserType {
    id:string;
    email:string;
    name:string;
    password:string
}

interface SessionType{
    email:string;
    password:string;
}

interface SessionResponseType{
    msg:string;
    data:{
        email:string;
        password:string;
    }
}