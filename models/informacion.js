const {Schema, model} = require('mongoose');

const informacionSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
        unique: true
    },
    foto: {
        type: String,
        required: [true, 'La foto es obligatoria'],
        unique: true
    },
    clasificacion: {
        type: String,
        required: [true, 'La clasificacion es obligatoria'],
    }
});

informacionSchema.methods.toJSON = function()
{
    const {__v, ...informacion } = this.toObject();
    informacion.uid = _id;

    return informacion
}

module.exports = model('Informacion', informacionSchema);