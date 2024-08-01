import mongoose from "mongoose";
import envs from "./envs.config.js"


//creamos funcion para que haga conección con la BD
export const connectMongoDB= async()=>{
    try {
        mongoose.connect (envs.MONGO_URL);
        console.log("Mongo DB conectado");
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", msg: "error interno del sevidor" });
    }
}