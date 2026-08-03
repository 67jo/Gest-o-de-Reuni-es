import { createApp } from "./app";




const start = () =>{
   try{
        const app = createApp();

        app.listen({
            port: 3333,
            host: "0.0.0.0"
        });

        console.log("🚀 Server running on port 3333");
   }catch(error){
        console.log(error);
        process.exit(1);
   }
};

start();