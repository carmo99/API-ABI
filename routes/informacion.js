const { Router } = require('express');

const { check } = require('express-validator');
const { subirInformacion, 
        subirFotoInfo,
        obtenerNoticia, 
        obtenerNoticias} = require('../controllers/informacion');
const { esClasificacionValida, existeInfoId } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const {validarCampos} = require('../middlewares/validar-campos');
const { extensionValida } = require('../middlewares/validar-extension');

const {validarJWT} = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//Subir Info
router.post('/',[
    validarJWT,
    esAdminRole,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('contenido', 'El contenido es obligatorio').not().isEmpty(),
    check('clasificacion').custom( esClasificacionValida ),
    validarCampos
], subirInformacion);

//Ponerle foto a una info
router.post('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeInfoId ),
    validarArchivoSubir,
    extensionValida,
    validarCampos
],subirFotoInfo);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeInfoId),
    validarCampos
], obtenerNoticia)

router.get('/', obtenerNoticias);

module.exports = router;





