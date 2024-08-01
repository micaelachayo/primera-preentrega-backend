import fs from "fs";
import { v4 as UUID } from "uuid";

let carts = [];
const path = "./src/data/cart.json";

//primero hacemos una funciona para llamar al carrito y ver que hay dentro

     const getCart = async () => {
  try {
    const cartJson = await fs.promises.readFile(path, "utf-8");
    //ahora todo lo que encuentre dentro el json, que lo transforme a un objeto de js y si no hay nada que devuelva []
    carts = JSON.parse(cartJson) || [];
    return carts;
  } catch (error) {
    console.log(`${error}`);
  }
};

//creamos un carrito
const createCart = async () => {
  try {
    await getCart();

    const newCart = {
      id: UUID(),
      products: []
    };
    //agrega al cart los productos nuevos del cart
    carts.push(newCart);
    //Lo escribe en el json.
    await fs.promises.writeFile(path, JSON.stringify(carts));
    return newCart;
  } catch (error) {
    console.log(`${error}`);
  }
};

//recibimos el carrito dependiendo del id
const getCartById = async (cid) => {
  try {
    //primero miramos todos los produuctos que tenemos en el carrito
    await getCart();
    //buscamos el carrito necesitado
    const cart = carts.find((c) => c.id === cid);
    return cart;
  } catch (error) {
    console.log(`${error}`);
  }
};

//Agregando producto al carrito y para eso recibimos por parametro el id del carrito y el del producto y que el quantity=1
const addProductToCart = async (cid, pid) => {
  await getCart();
  const cart = await getCartById(cid);

  //findIndex para buscar si el producto ya existe en el carrito.
  const productIndex = cart.products.findIndex(p => p.product === pid);

//Si el índice del producto (productIndex) no es -1 (sería como un null, el -1), significa que el producto ya existe.
  if (productIndex !== -1) {
    // Si el producto existe, incrementar la cantidad
    cart.products[productIndex].quantity += 1;
  } else {
    // Si el producto no existe, agregarlo al carrito
    const product = {
      product: pid,
      quantity: 1
    };
    cart.products.push(product);
  }
  await fs.promises.writeFile(path, JSON.stringify(carts));
  return cart;
};
export default { createCart, getCartById, addProductToCart};