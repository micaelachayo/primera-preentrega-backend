import mongoose from "mongoose";
const cartColeccion="carts"; //nombre de la coleccion
const cartSchema = new mongoose.Schema({
    products:{
       type: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, quantity: Number }],
        default: []
    },
});
cartSchema.pre("findOne", function () {
    this.populate("products.product");
  });
  
 export const cartmodel= mongoose.model(cartColeccion,cartSchema);