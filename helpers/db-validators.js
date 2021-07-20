const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Gadget = require('../models/gadget');

const esRolValido = async (rol= '') => 
{
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
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

const existeGadget = async (id = '') => 
{
    const existeGadget = await Gadget.findById(id);

    if(!existeGadget)
    {
        throw new Error(`El gadget con id ${id} no está definido en la base de datos`);
    }
    if(!existeGadget.gadget)
    {
        throw new Error(`El gadget con id ${id} ya ha sido registrado anteriormente`);
    }
}

// const existeEmail_Cambio = async (correonuevo = '', id = '')=>
// {
//     console.log(id);
//     const {correo} = await Usuario.findById(id);
//     correonuevo = correonuevo.toLocaleLowerCase();
//     console.log(correonuevo);
//     if(correonuevo != correo)
//     {
//         const existeemail = await Usuario.findOne({correocorreonuevo});
//         if(existeemail)
//         {
//             throw new Error(`El correo ${correo} ya está registrado`)
//         }
//     }
// }

const existeUsuarioPorId = async (id = '')=>
{
    const existeusuario = await Usuario.findById(id);
    if(!existeusuario)
    {
        throw new Error(`El ID ${id} no existe`)
    }
}

const existeTelefono = async (telefono = '')=>
{
    const existetelefono = await Usuario.findOne({telefono});
    if(existetelefono)
    {
        throw new Error(`El telefono ${telefono} ya está registrado`)
    }
}

module.exports={
    esRolValido,
    existeEmail,
    //existeEmail_Cambio,
    existeUsuarioPorId,
    existeTelefono,
    existeGadget
}

