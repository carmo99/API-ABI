const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRol, tieneRole } = require('../middlewares/validar-roles');
const {validarCampos,
    validarJWT,
    esAdminRol, 
    tieneRole} = require('../middlewares/validar-campos');

const {usuarioGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch} = require('../controllers/usuarios');

const { esRolValido, 
        existeEmail,
        existeUsuarioPorId,
        existeTelefono} = require('../helpers/db-validators');


const router = Router();

//CAMBIAR GET PARA QUE SE PUEDA HACER LA VALIDACIÓN DEL USUARIO CON EL JWT
//QUE NO SEA NECESARIO ENVIAR EL ID, EL USUARIO SOLO PODRÁ OBTENER SU INFORMACIÓN
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuarioGet);

//CAMBIAR PUT PARA QUE SE PUEDA HACER LA VALIDACIÓN DEL USUARIO CON EL JWT
//QUE NO SEA NECESARIO ENVIAR EL ID, EL USUARIO SOLO PODRÁ CAMBIAR SU INFORMACIÓN
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    check('telefono', 'El telefono debe ser de 10 digitos').isLength(10),
    check('telefono').custom( existeTelefono ),
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