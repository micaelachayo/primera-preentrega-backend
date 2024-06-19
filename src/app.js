import express from "express";
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/cart.router.js";

const PORT = 8080;

const app = express();
app.use (express.json ()); //middleware, para poder usar todas las expreciones de json
app.use (express.urlencoded ({extended:true}));
app.use ("/api", productsRouter);
app.use ("/api", cartRouter);

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});
