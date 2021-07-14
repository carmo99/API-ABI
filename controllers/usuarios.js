const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


 const usuarioGet =async (req, res = response) =>
 {
    const {id} = req.params;
    const {nombre, correo, contrasenia, telefono} = await Usuario.findById(id)
    res.json({
        nombre, 
        correo,  
        telefono
    });
 }

 const usuariosPost = async (req, res = response) =>
 {
    const {nombre, contrasenia, telefono} = req.body;
    const correo = req.body.correo.toLowerCase();
    const usuario = new Usuario({nombre, correo, contrasenia, telefono});
    
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);
    await usuario.save();

    res.json({
        usuario
    });
}


 const usuariosPut = async (req, res = response) =>
 {
    const {id} = req.params;
    const info = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id, info);
    res.json(usuario);
}

const usuariosPatch = (req, res = response) =>
{
    res.json({
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async(req, res = response) =>
{
    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json(usuario);
}
 module.exports = {
    usuarioGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
 }