const { response } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


//  const usuarioGet =async (req, res = response) =>
//  {
//     if(!req.usuario)
//     {
//         return res.status(500).json(
//         {
//             msg: 'Se quiere validar el token primero'
//         });
//     }
//     const {nombre, correo, telefono} = req.usuario;
//     res.json({
//         nombre, 
//         correo,  
//         telefono
//     });
//  }

//  const usuariosPost = async (req, res = response) =>
//  {
//     const {nombre, contrasenia, telefono} = req.body;
//     const correo = req.body.correo.toLowerCase();
//     const usuario = new Usuario({nombre, correo, contrasenia, telefono});
    
//     //Encriptar la contraseña
//     const salt = bcryptjs.genSaltSync();
//     usuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);
//     await usuario.save();

//     res.json({
//         usuario
//     });
// }


 const usuariosPut = async (req, res = response) =>
 {
    const token = req.header('x-token');

    const mensajeAyuda = req.body;
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const cambios = await Usuario.findByIdAndUpdate(uid, mensajeAyuda);
    res.json(cambios);
}


const usuariosDelete = async(req, res = response) =>
{
    const token = req.header('x-token');
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(uid, {estado:false});

    res.json(usuario);
}
 module.exports = {
    // usuarioGet,
    // usuariosPost,
    usuariosPut,
    usuariosDelete
 }