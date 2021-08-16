
const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    contrasenia: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },
    fotoPerfil: {
        type: String,
        default: 'https://res.cloudinary.com/fotosdeabi/image/upload/v1629154529/Predefinidas/abi_muestra_show_border_white_2_rhgc1f.png'
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        default: 'USER_ROL',
    },
    estado: {
        type: Boolean,
        default: true
    },
    contactoEmergencia1:
    {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    contactoEmergencia2:
    {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    contactoEmergencia3:
    {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    fotoDia: {
        type: String
    },
    mensajeAyuda:{
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        default: 'Necesito de tu ayuda, entra lo antes posible a la aplicación de ABI',
    },
    gadget:{
        type: Schema.Types.ObjectId,
        ref: 'Gadget',
    }
});

usuarioSchema.methods.toJSON = function()
{
    const {__v, contrasenia,_id, ...usuario } = this.toObject();
    usuario.uid = _id;

    return usuario
}

module.exports = model('Usuario', usuarioSchema);