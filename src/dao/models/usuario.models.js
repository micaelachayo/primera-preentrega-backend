import mongoose from "mongoose";

const usersColeccion= "users";
const userSchema=  new mongoose.Schema({
    first_name: String,
    last_name: String,
    age:Number,
    email: {type: String, unique: true},
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' },
},
{timestamps:true, strict: false}

) 
export const usuarioModelo=mongoose.model(usersColeccion,userSchema);

