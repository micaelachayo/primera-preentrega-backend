//ACA HACEMOS EL CRUD
import { cartmodel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

const getById = async (id) => {
  const cart = await cartmodel.findById(id);
  return cart;
};
const createCart = async (data) => {
  const create = await cartmodel.create(data);
  return create;
};
const addProductToCart = async (cid, pid) => {
  try {
    // Intentar encontrar y actualizar el producto en el carrito
    const productInCart = await cartmodel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    // Si el producto no está en el carrito, agregarlo
    if (!productInCart) {
      await cartmodel.updateOne(
        { _id: cid },
        { $push: { products: { product: pid, quantity: 1 } } }
      );
    }

    // Retornar el carrito actualizado
    const cart = await cartmodel.findById(cid);
    return cart;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};



const UpdateQuantity = async (cid, pid, quantity) => {
  const cart = await cartmodel.findOneAndUpdate(
    { _id: cid, "products.product": pid },
    { $set: { "products.$.quantity": quantity } }, // me setea la quantity que estamos pasando
    {new: true}
  );
  return cart;
};

//Eliminar el producto del carrito
const deleteProduct= async(cid, pid)=>{
const cart= await cartmodel.findById(cid);
const product = cart.products.filter(prod=>prod.product._id.toString()=== pid);
const cartResponse= await cartmodel.findByIdAndUpdate(cid, {$set:{products: product}}, {new: true});
return  cartResponse;
}

//Elimina todo el carrito
const deleteAllTheCart=async (cid)=>{
  const cart= cartmodel.findByIdAndUpdate (cid,{$set:{products:[]}}, {new:true});
  return cart;
}

export default {
  getById,
  createCart,
  addProductToCart,
  UpdateQuantity,
  deleteAllTheCart,
  deleteProduct
};
