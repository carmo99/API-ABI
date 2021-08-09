const { validationResult } = require('express-validator');

const validarCampos = (req=request, res= response, next) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = errors.array();
        return res.status(400).json(
            {
                "msg": error[0].msg
            });
    }
    
    next();
}

module.exports =
{
    validarCampos
}