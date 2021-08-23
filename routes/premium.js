const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const { validarContacto, 
        validarEspacio,
        validarBorrado} = require('../middlewares/validar-cambios');

const {validarJWT} = require('../middlewares/validar-jwt');


const { cambiarMensaje,
        agregarContacto,
        actualizarImagen,
        mostrarImagen,
        obtenerContactos,
        borrarContacto} = require('../controllers/premium');

const { esPremiumRole } = require('../middlewares/validar-roles');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { extensionValida } = require('../middlewares/validar-extension');


const router = Router();

router.put('/mensaje',[
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
], agregarContacto);


router.put('/foto',[
    validarJWT,
    esPremiumRole,
    validarArchivoSubir,
    extensionValida,
    validarCampos
], actualizarImagen); 

router.get('/foto',[
    validarJWT,
    esPremiumRole,
    validarCampos
],mostrarImagen);

router.get('/contactos',
[
    validarJWT,
    esPremiumRole,
    validarCampos
], obtenerContactos);

router.post('/borrar/contactos/:contacto', [
    validarJWT,
    esPremiumRole,
    validarBorrado,
    validarCampos
],borrarContacto)

module.exports = router;