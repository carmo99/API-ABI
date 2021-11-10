const {response, request} = require('express');

const extensionValida = (req, res = response, next) => {

    const { name } =  req.files.archivo;
    const [,extension] = name.split('.');
    const extensionesValidas = ['png', 'jpg', 'jpeg'];

    if ( !extensionesValidas.includes(extension)) {
        return res.status(401).json({ 
            msg: `Las extensiones permitidas son: png, jpg, jpeg` 
        });
    }
    
    next();
}

module.exports = {
    extensionValida
}