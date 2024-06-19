import productManager from "../productManager.js";

export const checkProductData = async (req, res, next) => {
  try {
    const body = req.body;
    const { title, description, price, thumbnail, code, stock, category } =
      body;
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    };
    //generamos un array con todos los valores de arriba y si incluye un undifined que me tire error.
    if (!title || !description || !price || !code || !stock || !category) {
      return res
        .status(400)
        .json({ status: "error", msg: "Todos los campos son obligatorios" });
    }
    // Verificar que el código sea único
    const products = await productManager.getProducts();
    //el some comprueba si al menos un elemento del array tiene esa condicion. es por eso q no  necesito hacer un map
    const codeExists = products.some((p) => p.code === code);
    if (codeExists) {
      return res
        .status(400)
        .json({ status: "error", msg: "El código debe ser único" });
    }
    // Next permite que continué la ejecución del endpoint
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", msg: "Error interno del servidor" });
  }
};
