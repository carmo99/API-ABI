const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const {validarJWT} = require('../middlewares/validar-jwt');


const { login, 
    verificarSesion, 
    generarOTP,
    verificaOTP,
    cambiarContraseniaOTP} = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('correo', 'El correo no es válido').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.post('/verificacion', [
    validarJWT,
    validarCampos
], verificarSesion)

router.post('/generarOTP', [
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], generarOTP)

router.post('/verificar/OTP', [
    check('correo', 'El correo no es válido').isEmail(),
    check('otp', 'El otp es obligatorio').not().isEmpty(),
    validarCampos
], verificaOTP)

router.post('/cambiar/contrasenia', [
    check('correo', 'El correo no es válido').isEmail(),
    check('contrasenia', 'La contraseña debe de ser mayor o igual a 8 caracteres').isLength({min: 8}),
    validarCampos
], cambiarContraseniaOTP)

module.exports = router;

