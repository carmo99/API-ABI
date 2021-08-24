const {response, request} = require('express');

const extensionValida = (req, res = response, next) => {

    const { name } =  req.files.archivo;
    const [,extension] = name.split('.');
    const extensionesValidas = ['png', 'jpg', 'jpeg'];

    if ( !extensionesValidas.includes(extension)) {
        return res.status(401).json({ 
            msg: `La extensión: ${extension} no es permitida` 
        });
    }
    
    next();
}

module.exports = {
    extensionValida
}