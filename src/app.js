import express from "express";
import handlebars from 'express-handlebars';
import __dirname from "./dirname.js";
import viewRoutes from "./routes/view.routes.js";
import {Server} from "socket.io";
import router from "./routes/index.routes.js";
import { connectMongoDB } from "./config/mongodb.config.js";
import envs from "./config/envs.config.js";


const app = express();
connectMongoDB();

app.engine("handlebars", handlebars.engine()); // Inicia el motor del la plantilla
app.set("views", __dirname + "/views"); // Indicamos que ruta se encuentras las vistas
app.set("view engine", "handlebars"); // Indicamos con que motor vamos a utilizar las vistas

app.use(express.json()); //middleware para usar tods las expresiones de json
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/", viewRoutes);
app.use ("/api", router);

const httpServer= app.listen(envs.PORT, () => {
  console.log(`servidor escuchando en el puerto ${envs.PORT}`);
});

//configuro socket
export const io=new Server (httpServer);
io.on ("connection", (socket)=>{
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);
});