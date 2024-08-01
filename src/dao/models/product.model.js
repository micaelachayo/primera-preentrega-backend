import mongoose from "mongoose";
import  paginate from "mongoose-paginate-v2";

const productColeccion="products"; //nombre de la coleccion
const productSchema = new mongoose.Schema({
 title:{
    type: String,
    require: true //que si o si tenga titulo
 },
 description:{
    type: String
 },
 code:{
    type: String,
    unique: true //que sea unico el código.
 },
 stock:{
    type: Number
 },
 status:{
    type: Boolean,
    default: true
 },
 category:{
    type: String
 },
 price:{
    type: Number,
    default: 0
 },
 thumbnail:{
    type: Array,
    default:[]
 }
});
productSchema.plugin(paginate);

 export const productModel=mongoose.model(productColeccion,productSchema);