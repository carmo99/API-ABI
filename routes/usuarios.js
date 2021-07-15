const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const {validarCorreoCambio,
    validarTelefonoCambio} = require('../middlewares/validar-cambios');

const {validarJWT} = require('../middlewares/validar-jwt');


const {usuarioGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete} = require('../controllers/usuarios');

const { existeEmail,
        existeTelefono} = require('../helpers/db-validators');

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
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    validarTelefonoCambio,
    validarCampos    
], usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    check('contrasenia', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    check('telefono').custom( existeTelefono ),
    validarCampos
] , usuariosPost);

router.delete('/',[
    validarJWT,
], usuariosDelete);

module.exports = router;