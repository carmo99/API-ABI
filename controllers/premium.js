const { response } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );




const Usuario = require('../models/usuario');

 const cambiarMensaje = async (req, res = response) =>
 {
    const mensajeAyuda = req.body;
    const id = req.usuario._id;
    const cambios = await Usuario.findByIdAndUpdate(id, mensajeAyuda);
    res.json(cambios);
}

const agregarContacto = async (req, res = response) =>
{
    const id = req.usuario._id;
    let cambios = null;
    switch (req.contactoLibre)
    {
        case 1:
            cambios = await Usuario.findByIdAndUpdate(id, {contactoEmergencia1: req.idContacto});
        break;
        case 2:
            cambios = await Usuario.findByIdAndUpdate(id, {contactoEmergencia2: req.idContacto});
        break;
        case 3:
            cambios = await Usuario.findByIdAndUpdate(id, {contactoEmergencia3: req.idContacto});
        break;
    }
    res.json(cambios);
}

const actualizarImagen = async(req, res = response) => {

    const id = req.usuario._id;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
        return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }

    //Limpiar imagene previas
    if ( usuario.fotoDia ) {
        //Hay que borrar la imagen del servidor
        const nombrArr  = usuario.fotoDia.split('/');
        const nombre    = nombrArr[ nombrArr.length - 1 ];
        const[ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
       
    }
    
    const{ tempFilePath } = req.files.archivo;
    
    const { secure_url }= await cloudinary.uploader.upload( tempFilePath );
    usuario.fotoDia = secure_url;

    await usuario.save();

    res.json({
        usuario
    });

}

const mostrarImagen = async ( req, res = response) => {
    const id = req.usuario._id;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
        return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }

    if ( usuario.fotoDia ) {
        //Hay que borrar la imagen del servidor
        const url = usuario.fotoDia;
        
        return res.json({
            url
        })
        
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');

    return res.sendFile( pathImagen );

}
 module.exports = {
    cambiarMensaje,
    agregarContacto,
    actualizarImagen,
    mostrarImagen
 }