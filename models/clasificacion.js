const {Schema, model} = require('mongoose');

const ClasifiacionSchema = Schema({
    clasificacion:
    {
        type: String,
        required: [true, "La clasificacion es obligatoria"]
    }
});

module.exports = model('Clasificacion', ClasifiacionSchema);