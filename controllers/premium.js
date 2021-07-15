const { response } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

 module.exports = {
    cambiarMensaje,
    agregarContacto
 }