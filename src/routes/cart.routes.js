import { Router } from "express";
import cartDao from "../dao/cart.dao.js";
import { checkProductAndCart } from "../middleware/checkProductAndCart.middleware.js";

const router = Router();

//creamos carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cartDao.createCart();

    res.status(201).json({ status: "ok", cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});

//buscamos carrido con id
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartDao.getById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", msg: "Carrito no encontrado" });

    res.status(201).json({ status: "ok", cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Añadir producto al carrito
router.post("/:cid/product/:pid", checkProductAndCart, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.addProductToCart(cid, pid);
    res.status(201).json({ status: "ok", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});

//actualizar
router.put("/:cid/product/:pid", checkProductAndCart, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.UpdateQuantity(cid, pid);
    res.status(201).json({ status: "ok", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});

//Borrar solamente un producto del carrito
router.delete("/:cid/product/:pid", checkProductAndCart, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.deleteProduct(cid, pid);
    res.status(201).json({ status: "ok", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});
//Borrar todo el carrito
router.delete("/:cid", checkProductAndCart, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", msg: "Carrito no encontrado" });
    }
    const cartResponse = await cartDao.deleteAllTheCart(cid);
    res.status(201).json({ status: "ok", cart: cartResponse });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
});

export default router;
 