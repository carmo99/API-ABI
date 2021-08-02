const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const Gadget = require('../models/gadget');

const { generarJWT } = require('../helpers/generaJWT');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );


const usuarioGet = async (req, res = response) => {
    if (!req.usuario) {
        return res.status(500).json(
            {
                msg: 'Se quiere validar el token primero'
            });
    }
    const { nombre, correo, telefono } = req.usuario;
    res.json({
        nombre,
        correo,
        telefono
    });
}

const usuariosPost = async (req, res = response) => {
    const { nombre, contrasenia, telefono } = req.body;
    const correo = req.body.correo.toLowerCase();
    const usuario = new Usuario({ nombre, correo, contrasenia, telefono });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);
    await usuario.save();

    const {id} = await Usuario.findOne({correo});

    const token = await generarJWT( id );

    res.json({
        usuario,
        token
    });
}


const usuariosPut = async (req, res = response) => {
    const id = req.usuario._id;

    const { nombre, telefono } = req.body;
    const correo = req.body.correo.toLowerCase();
    const usuario = { nombre, telefono, correo }

    const cambios = await Usuario.findByIdAndUpdate(id, usuario);
    res.json(cambios);
}

const usuariosDelete = async (req, res = response) => {
    const id = req.usuario._id;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json(usuario);
}

const registrarGadget = async (req, res = response) => {
    const id = req.usuario._id;
    let usuario = await Usuario.findByIdAndUpdate(id, { gadget: req.body.gadget });
    usuario = await Usuario.findByIdAndUpdate(id, { rol: 'PREMIUM_ROLE' });
    const gadget = await Gadget.findByIdAndUpdate(req.body.gadget, { gadget: false });
    res.json(usuario);
}

const cambiarContraseña = async (req, res = response) => {

    const contraseniaNueva = req.body.contraseniaNueva;
    const usuario = req.usuario;

    //Si pasa el middleware y las contraseñas coinciden, cambia por la nueva
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.contrasenia = bcryptjs.hashSync(contraseniaNueva, salt);
    await usuario.save();

    res.json(usuario);
}

const subirFotoPerfil = async (req, res = response) => {

    const usuario = req.usuario;
    if ( usuario.fotoPerfil ) {
        const nombreArr = usuario.fotoPerfil.split('/');
        const nombre    = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }
    
    const { tempFilePath } = req.files.archivo;
    const { secure_url }= await cloudinary.uploader.upload( tempFilePath );

    usuario.fotoPerfil = secure_url;

    await usuario.save();

    res.json({
        usuario
    })
}

module.exports = {
    usuarioGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    registrarGadget,
    cambiarContraseña,
    subirFotoPerfil
}