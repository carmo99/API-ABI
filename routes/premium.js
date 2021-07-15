const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const {validarContacto, 
    validarEspacio} = require('../middlewares/validar-cambios');

const {validarJWT} = require('../middlewares/validar-jwt');


const {cambiarMensaje,
    agregarContacto,} = require('../controllers/premium');

const { esPremiumRole } = require('../middlewares/validar-roles');


const router = Router();

// //CAMBIAR GET PARA QUE SE PUEDA HACER LA VALIDACIÓN DEL USUARIO CON EL JWT
// //QUE NO SEA NECESARIO ENVIAR EL ID, EL USUARIO SOLO PODRÁ OBTENER SU INFORMACIÓN
// router.get('/',[
//     validarJWT,
//     validarCampos
// ], usuarioGet);

//CAMBIAR PUT PARA QUE SE PUEDA HACER LA VALIDACIÓN DEL USUARIO CON EL JWT
//QUE NO SEA NECESARIO ENVIAR EL ID, EL USUARIO SOLO PODRÁ CAMBIAR SU INFORMACIÓN
router.put('/mensaje/',[
    validarJWT,
    esPremiumRole,
    check('mensajeAyuda', 'El mensaje de ayuda no debe estar vacio').not().isEmpty(),
    validarCampos    
], cambiarMensaje);

router.put('/contactoNuevo', [
    validarJWT,
    esPremiumRole,
    validarEspacio,
    validarContacto
], agregarContacto)


// router.post('/',[
//     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
//     check('correo', 'El correo no es válido').isEmail(),
//     check('correo').custom( existeEmail ),
//     check('contrasenia', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
//     check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
//     check('telefono').custom( existeTelefono ),
//     validarCampos
// ] , usuariosPost);


module.exports = router;