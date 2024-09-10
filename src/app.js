import express from "express";
import handlebars from 'express-handlebars';
import __dirname from "./dirname.js";
import viewRoutes from "./routes/views.routes.js";
import {Server} from "socket.io";
import router from "./routes/index.routes.js";
import { connectMongoDB } from "./config/mongodb.config.js";
import envs from "./config/envs.config.js";
import cookieParser from "cookie-parser";
import  register  from "./routes/session.routes.js";
import {router as viewSession} from "./routes/viewsSession.routes.js"
import passport from "passport";
import { initPassport } from "./config/passport.config.js";

const app = express();
connectMongoDB();
app.use(cookieParser())
app.engine("handlebars", handlebars.engine()); // Inicia el motor del la plantilla
app.set("views", __dirname + "/views"); // Indicamos que ruta se encuentras las vistas
app.set("view engine", "handlebars"); // Indicamos con que motor vamos a utilizar las vistas

app.use(express.json()); //middleware para usar tods las expresiones de json
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

initPassport()
app.use(passport.initialize())

app.use("/", viewSession)
app.use("/products", viewRoutes);
app.use ("/api", router);
app.use("/api/session",register)

const httpServer= app.listen(envs.PORT, () => {
  console.log(`servidor escuchando en el puerto ${envs.PORT}`);
});

//configuro socket
export const io=new Server (httpServer);
io.on ("connection", (socket)=>{
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);
});