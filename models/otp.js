const {Schema, model} = require('mongoose');

const otpSchema = Schema({
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
    },
    otp: {
        type: String,
        required: [true, 'El otp es obligatorio']
    }
});

otpSchema.methods.toJSON = function()
{
    const {__v, ...informacion } = this.toObject();
    return informacion;
}

module.exports = model('Otp', otpSchema);