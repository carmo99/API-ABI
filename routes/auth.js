const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');


const { login, verificarSesion} = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.post('/verificacion', [
    validarJWT,
    validarCampos
], verificarSesion)


module.exports = router;

