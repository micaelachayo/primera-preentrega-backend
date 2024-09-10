import { Router } from 'express';

import { passportCall } from '../utils.js';
export const router=Router()

router.get('/login', (req,res)=>{
try{

    res.status(200).render('login');
} catch(error){
  console.error( error);
res
 .status(500)
.json({ status: 'error', msg: 'Error interno del servidor' });
}
});

router.get('/registro',(req,res)=>{
try{
  
res.status(200).render("registro");
} catch(error){
  console.error(error);
res
 .status(500)
.json({ status: 'error', msg: 'Error interno del servidor' });
}
});
router.get("/",(req,res)=>{
  try {
  
     res.status(200).render("home");
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
      {
        error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle:`${error.message}`
      }
    )
    
  }
})

router.get('/perfil', passportCall("current"), (req, res) => {
  if (!req.user) {
    return res.status(401).json('login', { mensaje: 'No autorizado' });
  }
  res.status(200).render('perfil', { usuario: req.user });
});
