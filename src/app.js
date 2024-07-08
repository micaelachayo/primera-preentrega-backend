import express from "express";
import handlebars from 'express-handlebars';
import __dirname from "./dirname.js";
import viewRoutes from "./routes/view.routes.js";
import {Server} from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";

const PORT = 8080;

const app = express();


app.engine("handlebars", handlebars.engine()); // Inicia el motor del la plantilla
app.set("views", __dirname + "/views"); // Indicamos que ruta se encuentras las vistas
app.set("view engine", "handlebars"); // Indicamos con que motor vamos a utilizar las vistas

app.use(express.json()); //middleware para usar tods las expresiones de json
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/", viewRoutes);
app.use ("/api", productsRouter);
app.use ("/api", cartRouter);

const httpServer= app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});

//configuro socket
export const io=new Server (httpServer);
io.on ("connection", (socket)=>{
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);
});