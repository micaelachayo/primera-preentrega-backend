import { Router } from "express";
import cartManager from "../cartManager.js";
import productManager from "../productManager.js";

const router = Router();

//creamos carrito 
router.post("/carts", async (req, res) => {
  try {
    const cart = await cartManager.createCart();

    res.status(201).json({ status: "ok", cart});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
})

//buscamos carrido con id
router.get("/carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
  
      const cart = await cartManager.getCartById(cid);
      if(!cart) return res.status(404).json({status: "error", msg: "Carrito no encontrado"})
        
      res.status(201).json({ status: "ok", cart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", msg: "Error interno del servidor" });
    }
  })

  //agregando productos a los carritos
  router.post ("/carts/:cid/product/:pid", async (req, res)=>{
 try {
    const {cid, pid}= req.params;
    const product= await productManager.getProductById (pid);
   if(!product){
   return res.status(404).json({ status: "error", msg: "Producto no encontrado" })
   };

    const cart =await cartManager.addProductToCart(cid,pid);
   if(!cart){
    return res.status(404).json({ status: "error", msg: "Carrito no encontrado" });
   };
   


    res.status(200).json({status:"ok", cart});
 } catch (error) {
    console.log(error);
      res.status(500).json({ status: "error", msg: "Error interno del servidor" });
 }

  })
  
export default router;