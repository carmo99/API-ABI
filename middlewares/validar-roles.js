const {response, request} = require('express');

const esPremiumRole = (req, res = response, next) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg:'Token no valido'
        });
    }

    const {rol,nombre} = req.usuario;

    if ( rol != 'PREMIUM_ROLE') {
        return res.status(401).json({
            msg:`${nombre} no es Premium`
        });
    }

    next();
}

const esAdminRole = ( req, res = response, next ) => {

    if (!req.usuario) {
        return res.status(500).json({ 
            msg: 'Token no valido'
        })
    }

    const { rol, nombre} = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador`
        })
    }

    next();
}

module.exports = {
    esPremiumRole,
    esAdminRole
}