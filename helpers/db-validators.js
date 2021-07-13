const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol= '') => 
{
    console.log(rol);
    const existeRol = await Role.findOne({rol});

    if(!existeRol)
    {
        throw new Error(`El rol ${rol} no está definido en la base de datos`)
    }
}


const existeEmail = async (correo = '')=>
{
    const existeemail = await Usuario.findOne({correo});
    if(existeemail)
    {
        throw new Error(`El correo ${correo} ya existe`)
    }
}

module.exports={
    esRolValido,
    existeEmail
}

