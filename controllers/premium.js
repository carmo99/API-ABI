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
    const usuario = await Usuario.findById(req.idContacto);
    console.log(usuario);
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
    usuario.ubicacionEmergencia.push(id);
    await usuario.save();
    
    res.json(cambios);
}

const actualizarImagen = async(req, res = response) => {

    const usuario = req.usuario;

    //Limpiar imagene previas
    if ( usuario.fotoDia ) {
        //Hay que borrar la imagen del servidor
        const nombrArr  = usuario.fotoDia.split('/');
        const nombre    = nombrArr[ nombrArr.length - 1 ];
        const[ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id )   
    }
    
    const{ tempFilePath } = req.files.archivo;
    
    const { secure_url }= await cloudinary.uploader.upload( tempFilePath );
    usuario.fotoDia = secure_url;

    await usuario.save();
    
    const persona = await Usuario.findById(usuario.id)
    .populate('contactoEmergencia1', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
    .populate('contactoEmergencia2', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
    .populate('contactoEmergencia3', ['nombre', 'fotoPerfil', 'telefono', 'correo'])

    res.json({
        'usuario':persona
    })
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
        const url = usuario.fotoDia;
        
        return res.json({
            url
        })
        
    }
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    return res.sendFile( pathImagen );

}

const obtenerContactos = async (req, res = response) =>
{
    const usuario = await Usuario.findById(req.usuario.id)
            .populate('contactoEmergencia1', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
            .populate('contactoEmergencia2', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
            .populate('contactoEmergencia3', ['nombre', 'fotoPerfil', 'telefono', 'correo'])

    res.json({
        'contactoEmergencia1':usuario.contactoEmergencia1,
        'contactoEmergencia2':usuario.contactoEmergencia2,
        'contactoEmergencia3':usuario.contactoEmergencia3
    })
}

const borrarContacto = async (req, res = response) =>
{
    const {contacto} = req.params;
    const id = req.usuario._id;
    const usuario = await Usuario.findById(id);
    let id_usuario_borrado;
    switch (contacto)
    {
        case "contactoEmergencia1":
            id_usuario_borrado = usuario.contactoEmergencia1._id;
            cambios = await Usuario.findByIdAndUpdate(id, {$unset:{"contactoEmergencia1":""}});
        break;
        case "contactoEmergencia2":
            id_usuario_borrado = usuario.contactoEmergencia2._id;
            cambios = await Usuario.findByIdAndUpdate(id, {$unset:{"contactoEmergencia2":""}});
        break;
        case "contactoEmergencia3":
            id_usuario_borrado = usuario.contactoEmergencia3._id;
            cambios = await Usuario.findByIdAndUpdate(id, {$unset:{"contactoEmergencia3":""}});
        break;
    }
    const usuario_borrado = await Usuario.findById({_id: id_usuario_borrado});
    const index = usuario_borrado.ubicacionEmergencia.indexOf(id);
    usuario_borrado.ubicacionEmergencia.splice(index, 1);
    await usuario_borrado.save();
    const persona = await Usuario.findById(id)
    .populate('contactoEmergencia1', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
    .populate('contactoEmergencia2', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
    .populate('contactoEmergencia3', ['nombre', 'fotoPerfil', 'telefono', 'correo'])

    res.json({
        'usuario':persona
    })
}

 module.exports = {
    cambiarMensaje,
    agregarContacto,
    actualizarImagen,
    mostrarImagen,
    obtenerContactos,
    borrarContacto
 }