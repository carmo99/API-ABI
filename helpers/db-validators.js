const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Gadget = require('../models/gadget');
const Clasificacion = require('../models/clasificacion');
const Informacion = require('../models/informacion');

const esRolValido = async (rol= '') => 
{
    const existeRol = await Role.findOne({rol});

    if(!existeRol)
    {
        throw new Error(`El rol ${rol} no está definido en la base de datos`)
    }
}

const esClasificacionValida = async (clasificacion = '') =>{
    const existeClas = await Clasificacion.findOne({clasificacion});
    if (!existeClas) {
       throw new Error(`La clasificación ${ clasificacion } no está registrada en la base de datos`);
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
    const existeGadget = await Gadget.findOne({codigo:id});
    if(existeGadget == null)
    {
        throw new Error(`El gadget con id ${id} no está registrado en la base de datos`);
    }
    if(existeGadget.estado == false)
    {
        throw new Error(`El gadget con id ${id} ya ha sido registrado anteriormente`);
    }
}

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

const existeInfoId = async( id ) => {
    const existeInfo = await Informacion.findById( id );
    if (!existeInfo) {
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports={
    esRolValido,
    existeEmail,
    //existeEmail_Cambio,
    existeUsuarioPorId,
    existeTelefono,
    existeGadget,
    esClasificacionValida,
    existeInfoId
}

