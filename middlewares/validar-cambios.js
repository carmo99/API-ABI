const {response, request} = require('express');
const Usuario = require('../models/usuario');

const validarCorreoCambio = async(req=request, res= response, next) =>
{
    if(!req.usuario)
    {
        return res.status(500).json(
        {
            msg: 'Se quiere validar el token primero'
        });
    }
    const correo = req.body.correo.toLowerCase();

    if(req.usuario.correo != req.body.correo)
    {
        const existeemail = await Usuario.findOne({correo});
        if(existeemail)
        {
            return res.status(500).json(
            {
                msg: `El correo ${correo} ya está registrado`
            });
        }
    }
    next();
}

const validarTelefonoCambio = async(req=request, res= response, next) =>
{
    if(!req.usuario)
    {
        return res.status(500).json(
        {
            msg: 'Se quiere validar el token primero'
        });
    }
    const telefono = req.body.telefono;

    if(req.usuario.telefono != req.body.telefono)
    {
        const existetelefono = await Usuario.findOne({telefono});
        if(existetelefono)
        {
            return res.status(500).json(
            {
                msg: `El telefono ${telefono} ya está registrado`
            });
        }
    }
    next();
}

const validarContacto = async(req=request, res= response, next) =>
{
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    const existetelefono = await Usuario.findOne({telefono});
    const existeemail = await Usuario.findOne({correo});
    if(!existetelefono)
    {
        return res.status(500).json(
        {
            msg: `El telefono ${telefono} no está registrado`
        });
    }
    if(! existeemail)
    {
        return res.status(500).json(
        {
            msg: `El correo ${correo} no está registrado`
        });
    }
    if(! existetelefono._id.equals(existeemail._id))
    {
        return res.status(500).json(
        {
            msg: `Los datos del nuevo contacto de emergencia no coinciden`
        });
    }

    if(existetelefono._id.equals(req.usuario._id))
    {
        return res.status(500).json(
        {
            msg: `No es posible agregarse a uno mismo como contacto de emergencia`
        });
    }
    let validacion1=false, validacion2=false, validacion3=false;
    if(req.usuario.contactoEmergencia1)
    {
        validacion1 = req.usuario.contactoEmergencia1.equals(existetelefono._id);
    }
    if(req.usuario.contactoEmergencia2)
    {
        validacion2 = req.usuario.contactoEmergencia2.equals(existetelefono._id);
    }
    if(req.usuario.contactoEmergencia3)
    {
        validacion3 = req.usuario.contactoEmergencia3.equals(existetelefono._id);
    }

    if(validacion1 || validacion2 || validacion3)
    {
        return res.status(500).json(
        {
            msg: `${existetelefono.nombre} ya está registrado como uno de tus contactos de emergencia`
        });
    }
    req.idContacto = existetelefono._id;
    
    next();
}

const validarEspacio = async(req=request, res= response, next) =>
{
    if(!req.usuario.contactoEmergencia1)
    {
        req.contactoLibre = 1;
    }
    else if(!req.usuario.contactoEmergencia2)
    {
        req.contactoLibre = 2;
    }
    else if(!req.usuario.contactoEmergencia3)
    {
        req.contactoLibre = 3;
    }
    else
    {
        return res.status(500).json(
        {
            msg: `Los espacios para agregar un contacto de emergencia se han agotado`
        });
    }    
    next();
}

module.exports =
{
    validarCorreoCambio,
    validarTelefonoCambio,
    validarContacto,
    validarEspacio
}