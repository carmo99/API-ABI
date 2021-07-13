const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRol, tieneRole } = require('../middlewares/validar-roles');
const {validarCampos,
    validarJWT,
    esAdminRol, 
    tieneRole} = require('../middlewares/validar-campos');

const {usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch} = require('../controllers/usuarios');

const { esRolValido, 
        existeEmail} = require('../helpers/db-validators');


const router = Router();

//router.get('/', usuariosGet);

// router.put('/:id',[
//     check('id', 'No es un ID válido').isMongoId(),
//     check('id').custom(existeUsuarioPorId),
//     check('rol').custom( esRolValido ),
//     validarCampos    
// ], usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    check('contrasenia', 'La contraseña debe de ser mayor a 6 caracteres').isLength({min: 6}),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    validarCampos
] , usuariosPost);

// router.delete('/:id',[
//     validarJWT,
//     //esAdminRol,
//     tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
//     check('id', 'No es un ID válido').isMongoId(),
//     check('id').custom(existeUsuarioPorId),
//     validarCampos
// ], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;