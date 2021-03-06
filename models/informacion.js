const {Schema, model} = require('mongoose');

const informacionSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
    },
    contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio']
    },
    foto: {
        type: String,
        default: 'https://res.cloudinary.com/fotosdeabi/image/upload/v1627942064/Predefinidas/Default_s8uyk0.png'
    },
    clasificacion: {
        type: String,
        required: [true, 'La clasificacion es obligatoria']
    }
});

informacionSchema.methods.toJSON = function()
{
    const {__v, clasificacion, contenido, ...informacion } = this.toObject();
    return informacion;
}

module.exports = model('Informacion', informacionSchema);