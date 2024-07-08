import { Router } from "express";
import productManager from "../productManager.js";
import {io} from "../app.js";

const router =Router();

router.get("/", async(req,res)=>{
//aca obtenemos los productos manager
const products= await productManager.getProducts();

//En pantalla va a parecer lo que puse en el archivo homehandlebars
res.render ("home", {products});
})
router.get("/realtimeproducts", async (req,res)=>{
    const products= await productManager.getProducts();

    //iniciamos una nueva conexion
    io.on ("connection", (socket)=>{
        console.log("Nuevo cliente conectado en Real Time Porducts");
    //enviamos los productos al cliente (front);
    socket.emit("products", products);

    });
    //en pantalla aparece lo q puse en archivo "realTimeProducts.handlebars"
    res.render ("realTimeProducts");

    //Nosotros ya le mandamos al front con emit para que escuche lo q le pedimos.Ahora necesitamos
    //que el fron escuche lo que le mandamos. y para eso lo hago en carpeta public index.js
});

//agregar
router.post("/realtimeproducts", async (req,res)=>{
   //esto para ver si me llegan los productos agregados
    console.log(req.body);
   //agregamos lo q me venga del body (req.body) en pantlla
    await productManager.addProduct (req.body);
    
    //ENtonces una vez que agregue el producto. q ahora me traiga todos los productos con el nuevo
    const products= await productManager.getProducts();
 io.emit("products", products);
    res.render ("realTimeProducts");
});

router.delete("/realtimeproducts", async(req,res)=>{
    const {id}=req.body;
    console.log(req.body);
    await productManager.deleteProduct(id);
    const products= await productManager.getProducts();
    io.emit("products", products);
    res.render ("realTimeProducts");
});

export default router;