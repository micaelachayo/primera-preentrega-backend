import { Router } from "express";
import productsDao from "../dao/products.dao.js";
import { checkProductData } from "../middleware/checkProductData.middleware.js";
import { io } from "../app.js";

const router= Router();

//me muestra todos los productos del array
router.get("/", async (req, res) => {
try {
const {limit,page,sort,category,status}=req.query;

const options={
  limit:limit ||10,
  page: page||1,
  sort:{
    price: sort === "asc"? 1: -1
  }
}

  const products = await productsDao.getAll({}, options);
res.setHeader('content-type', 'application/json');
  return res.status(200).json({ status: "ok", products });
} catch (error) {
  console.log(error);
  res.status(500).json({ status: "error", msg: "Error interno del servidor" }); 
}
});

//me muestra depende el id
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", msg: "Producto no encontrado" });

    res.status(200).json({ status: "ok", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

//actualizando
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    //le pasamos un req.body porque es un objeto y lo que venga del body, me lo actualice
    const body= req.body;
    const product = await productsDao.upDateProduct(pid,body);
    res.status(200).json({ status: "ok", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});

//agregando producto
router.post("/", checkProductData, async (req, res) => {
  try {
    const body = req.body;
    //ahora agregamos el producto que queremos subir desde el enpoint
    const product = await productsDao.createProduct(body);
    // Emitir el producto recién agregado a todos los clientes
    io.emit("products", product);

    res.status(201).json({ status: "agregado", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", msg: "error interno del sevidor" });
  }
});


router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsDao.deleteProduct(pid);
    await productsDao.deleteProduct(pid);
    if (!product)
      return res
        .status(404)
        .json({ status: "error", msg: "Producto no encontrado" });
      

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