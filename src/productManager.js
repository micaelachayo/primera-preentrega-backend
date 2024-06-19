import fs from "fs";
import { v4 as UUID } from "uuid";
//este es el nombre del archivo que voy a crear
const path = "./src/data/products.json";

//el archivo comenzara con un array vacio
let products = [];

//voy a ir agregando productos que obtengan (title, description y etc)
const addProduct = async (product) => {
  try {
    await getProducts();
    const { title, description, price, code, stock, category } = product;

    const newProduct = {
      //generamos que nos devuelva un producto con un id automaticamente
      id: UUID(),
      title,
      description,
      price,
      thumbnail: [],
      code,
      stock,
      statues: true,
      category,
    };

    products.push(newProduct);

    //me guarda el array de productos en un archivo (que en este caso es el archivo json) y
    //como el json no entiende los array de javascript hay que pasarlo a un texto plano.
    await fs.promises.writeFile(path, JSON.stringify(products));
    console.log("Producto agregado con éxito");

    return newProduct;
  } catch (error) {
    console.log(`${error}`);
  }
};

// Lee los productos que agreguemos
const getProducts = async () => {
  try {
    //lee el archivo de json
    const fileJson = await fs.promises.readFile(path, "utf-8");

    //vuelve a pasar todo lo stingify a objeto para poder leerlo
    const parseFile = JSON.parse(fileJson);
    //seteamos el valor de products (como un local sotrage, si no hay ningun objeto en el archivo, que me devuelva array vacio)
    products = parseFile || [];
    //ahora tiene que retornar los productos actualizados
    return products;
  } catch (error) {
    console.log(`${error}`);
  }
};

// Leer un product por id
const getProductById = async (id) => {
  //lee el archivo del Json (llamando al getProduct) y lo setea dentro de la variable product
  try {
    await getProducts();
    //vamos a llamar a nuestro array products que ya esta actualizada por medio de la funcion getProducts
    const product = products.find((p) => p.id === id);
    return product;
  } catch (error) {
    console.log(`${error}`);
  }
};

// Actualizar un producto y para eso tenemos que saber que id voy a modificar y que data
const upDateProduct = async (id, productData) => {
  try {
    //para que nos actualice la ultima info que tenga el json.
    await getProducts();
    //yo  necesito identificar el producto que voy a actualizar. cambiarlo y que se vuelva a agregar en el array sin cambiar el
    //valor. y para eso se necesita findIndex (encontarr en que posicion (que fila) se encuentra y modificar solo ese)
    const index = products.findIndex((p) => p.id === id);
    //ahora vamos a modificar los datos del inice
    products[index] = {
      //primero lo que hago es hacer una copia exacto de lo que tenia nuestro producto, para no perderlo
      ...products[index],
      //sobre esta copia, voy a sobreescribir de lo que venga de productdata
      ...productData,
    };
    //ahora tengo que acttualizar el json
    await fs.promises.writeFile(path, JSON.stringify(products));
    return products[index];
  } catch (error) {
    console.log(error);
  }
};

// Eliminar un product
const deleteProduct = async (id) => {
  try {
    await getProducts();
    //filtramos todos los productos que no coincidan con fese id
    products = products.filter((p) => p.id !== id);
    await fs.promises.writeFile(path, JSON.stringify(products));
    return products;
  } catch (error) {
    console.log(`${error}`);
  }
};

export default {
  addProduct,
  getProducts,
  getProductById,
  upDateProduct,
  deleteProduct,
};
