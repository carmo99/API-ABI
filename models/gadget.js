const {Schema, model} = require('mongoose');

const GadgetSchema = Schema({
    gadget:
    {
        type: Boolean,
        required: [true, "El gadget es obligatorio"]
    }
});

module.exports = model('Gadget', GadgetSchema);