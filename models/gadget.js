const {Schema, model} = require('mongoose');

const GadgetSchema = Schema({
    codigo: 
    {
        type: String,
        required: [true, "El código es obligatorio"]
    },
    estado:
    {
        type: Boolean,
        required: [true, "El estado es obligatorio"],
        default: true
    }
});

module.exports = model('Gadget', GadgetSchema);