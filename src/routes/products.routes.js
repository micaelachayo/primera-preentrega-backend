import { Router } from "express";
import productManager from "../productManager.js";
import { checkProductData } from "../middleware/checkProductData.middleware.js";


const router = Router();
//me muestra todos los productos del array
router.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (!products)
      return res
        .status(404)
        .json({ status: "error", msg: "producto no encontrado" });

   // Si hay un limit, limitamos la cantidad de productos devueltos
   //si hay algun limite query me va a devolver la cantidad que pase por la url. comienza desde el 0(primer producto) hasta
   //el q marque el cliente. xj: /products?limit=5 me traera los primeros 5 prod del array.
   const limitedProducts = limit ? products.slice(0, Number(limit)) : products;
    
   res.status(200).json({ status: "ok", products: limitedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

//me muestra depende el id
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product)
      return res
        .status(404)
        .json({ status: "error", msg: "producto no encontrado" });
    res.status(200).json({ status: "ok", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

//actualizando
router.put("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    //le pasamos un req.body porque es un objeto y lo que venga del body, me lo actualice
    const body= req.body;
    const product = await productManager.upDateProduct(pid, body);
    res.status(200).json({ status: "ok", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

//agregando producto
router.post("/products", checkProductData, async (req, res) => {
  try {
    const body = req.body;
    //ahora agregamos el producto que queremos subir desde el enpoint
    const product = await productManager.addProduct(body);
    res.status(201).json({ status: "agregado", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product)
      return res
        .status(404)
        .json({ status: "error", msg: "Producto no encontrado" });
        
    await productManager.deleteProduct(pid);

    res
      .status(200)
      .json({
        status: "ok",
        msg: `Producto con el ID ${pid} eliminado con éxito`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

export default router;