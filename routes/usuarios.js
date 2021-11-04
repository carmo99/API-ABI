const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const { validarCorreoCambio,
        validarTelefonoCambio,
        validarContrasenia} = require('../middlewares/validar-cambios');

const {validarJWT} = require('../middlewares/validar-jwt');


const { usuarioGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        registrarGadget,
        cambiarContraseña,
        subirFotoPerfil,
        usuariosVerifica} = require('../controllers/usuarios');

const { existeEmail,
        existeTelefono,
        existeGadget} = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { extensionValida } = require('../middlewares/validar-extension');

const router = Router();

router.get('/',[
    validarJWT,
    validarCampos
], usuarioGet);

router.put('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    validarCorreoCambio,
    check('telefono', 'El telefono deben ser solo numeros').isNumeric(),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    validarTelefonoCambio,
    validarCampos    
], usuariosPut);

router.put('/gadget',[
    validarJWT,
    check('gadget', 'No es un ID de Gadget Valido').isLength(10),
    check('gadget').custom(existeGadget),
    validarCampos    
], registrarGadget);

router.put('/contrasenia',[
    validarJWT,
    validarContrasenia,
    check('contraseniaNueva', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
    validarCampos    
], cambiarContraseña);

router.post('/verificar',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    check('contrasenia', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
    check('telefono', 'El telefono deben ser solo numeros').isNumeric(),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    check('telefono').custom( existeTelefono ),
    validarCampos
] , usuariosVerifica);

router.post('/salvar',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    check('contrasenia', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
    check('telefono', 'El telefono deben ser solo numeros').isNumeric(),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    check('telefono').custom( existeTelefono ),
    validarCampos
] , usuariosPost);

router.post('/foto',[
    validarJWT,
    validarArchivoSubir,
    extensionValida,
], subirFotoPerfil);

router.delete('/',[
    validarJWT,
], usuariosDelete);

module.exports = router;