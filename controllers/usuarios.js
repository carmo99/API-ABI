const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


 const usuariosGet =async (req, res = response) =>
 {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

     res.json({
        total,
        usuarios
    });
 }

 const usuariosPost = async (req, res = response) =>
 {
    const {nombre, correo, contrasenia, telefono} = req.body;
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
    const { _id, contrasenia, google, correo, ...resto} = req.body;

    if(contrasenia)
    {
        const salt = bcryptjs.genSaltSync();
        resto.contrasenia = bcryptjs.hashSync(contrasenia, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
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
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

 }