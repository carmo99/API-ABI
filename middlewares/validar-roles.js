const {response, request} = require('express');

const esPremiumRole = (req, res = response, next) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {rol,nombre} = req.usuario;

    if ( rol != 'PREMIUM_ROLE') {
        return res.status(401).json({
            msg:`${nombre} no es Premium - No puede hacer esto`
        });
    }

    next();
}

const esAdminRole = ( req, res = response, next ) => {

    if (!req.usuario) {
        return res.status(500).json({ 
            msg: 'Se quiere verificar el role sin validar el token primero'
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

//Pone todos los argumentos que se reciben en un arreglo
// const tieneRole = ( ...roles ) => {
    
//     //Recibo los argumentos y retorno una funcion que es la que se va a ejecutar
//     return (req, res = response, next) => {

//         // console.log(roles, req.usuario.rol);

//         if ( !req.usuario ) {
//             return res.status(500).json({
//                 msg:'Se quiere verificar el rol sin validar el token primero'
//             });
//         }

//         if (!roles.includes(req.usuario.rol)) {
//             return res.status(401).json({
//                 msg:`El servicio requiere uno de estos roles ${roles}`
//             });
//         }

//         next()
//     }
// }

module.exports = {
    esPremiumRole,
    esAdminRole
    // tieneRole
}