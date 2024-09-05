import { usuarioModelo } from "./models/usuario.models.js";

const createUsuario = async (id) => {
  const indentificacion = usuarioModelo.create(id);
  return indentificacion;
};

const existeUsuario = async (email) => {
  return usuarioModelo.findOne(email).lean();
};
export default {
  createUsuario,
  existeUsuario,
};
