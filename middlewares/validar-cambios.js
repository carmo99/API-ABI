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

    if(req.usuario.correo != req.params.correo)
    {
        const existeemail = await Usuario.findOne({correo: req.params.correo});
        if(existeemail)
        {
            return res.status(500).json(
            {
                msg: `El correo ${req.params.correo} ya está registrado`
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

    if(req.usuario.telefono != req.params.telefono)
    {
        const existeemail = await Usuario.findOne({correo: req.params.telefono});
        if(existeemail)
        {
            return res.status(500).json(
            {
                msg: `El correo ${req.params.telefono} ya está registrado`
            });
        }
    }
    next();
}

module.exports =
{
    validarCorreoCambio,
    validarTelefonoCambio
}