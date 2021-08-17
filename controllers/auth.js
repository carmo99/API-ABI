const { response } = require('express');
const bcryptjs = require('bcryptjs');

const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')

const Usuario = require('../models/usuario');
const Otp = require('../models/otp');

const { generarJWT } = require('../helpers/generaJWT');



const login = async (req, res = response) => {
    
    const { correo, contrasenia } = req.body;

    try {
        
        //Verificar si el correo exited
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({ 
                msg: 'Usuario / password incorrectos'
            });
        }

        //Verificar si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({ 
                msg: 'Usuario / passwor incorrectos estado: false'
            });
        }

        // Verificar la contraseña
        const validaContrasenia = bcryptjs.compareSync( contrasenia, usuario.contrasenia );
        if ( !validaContrasenia) {
            return res.status(400).json({ 
                msg: 'Usuario / password incorrectos '
            });
        }

        //Generamos el JWT
        const token = await generarJWT( usuario.id );
        const persona = await Usuario.findById(usuario.id)
                .populate('contactoEmergencia1', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
                .populate('contactoEmergencia2', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
                .populate('contactoEmergencia3', ['nombre', 'fotoPerfil', 'telefono', 'correo'])

        res.json({
            'usuario':persona,
            token
        })
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({ 
            msg: 'Hable con el administrador'
        });
    }
}

const verificarSesion = async (req, res) => {
    try{
        const {id} = req.usuario;

        const usuario = await Usuario.findById(id);
        const token = await generarJWT( usuario.id );
        const persona = await Usuario.findById(usuario.id)
                .populate('contactoEmergencia1', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
                .populate('contactoEmergencia2', ['nombre', 'fotoPerfil', 'telefono', 'correo'])
                .populate('contactoEmergencia3', ['nombre', 'fotoPerfil', 'telefono', 'correo'])

        res.json({
            'usuario':persona,
            token
        })
    } catch (error) {
        console.log( error );
        return res.status(500).json({ 
            msg: 'Hable con el administrador'
        });
    }
}

const generarOTP = async (req, res = response) =>
{
    const { correo } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        return res.status(400).json({ 
            msg: 'El correo no existe'
        });
    }

    //Verificar si el usuario esta activo
    if ( !usuario.estado ) {
        return res.status(400).json({ 
            msg: 'El usuario no existe'
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USUARIO_MAIL,
          pass: process.env.CONTRASENIA_MAIL
        }
      });
    const otp = otpGenerator.generate(10, { upperCase: false, specialChars: false });

    const mensaje = `Hola ${usuario.nombre}, este es tu código de verificación de correo: ${otp}`;
    const mailOptions = {
        from: 'jocaes911@gmail.com',
        to: usuario.correo,
        subject: 'Validación de correo',
        text: mensaje
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });

    //Verifica si el correo existe en OTP
    const usuarioOTP = await Otp.findOne({ correo });
    if ( usuarioOTP ) {
        const borrado = await Otp.findByIdAndDelete({'_id':usuarioOTP._id})
    }

    const almacenaotp = new Otp({ correo });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    almacenaotp.otp = bcryptjs.hashSync(otp, salt);
    await almacenaotp.save();

    res.json({
        'msg': 'Ok'
    })
}

const verificaOTP = async (req, res = response) =>
{
    //Verifica si el correo existe en OTP
    const { correo, otp } = req.body;
    const usuarioOTP = await Otp.findOne({ correo });
    if ( !usuarioOTP ) {
        return res.status(400).json({ 
            msg: 'Correo no valido'
        });
    }

    //Comparar OTP's
    const validaOTP = bcryptjs.compareSync( otp, usuarioOTP.otp );
    if ( !validaOTP) {
        return res.status(400).json({ 
            msg: 'OTP no valido'
        });
    }

    const borrado = await Otp.findByIdAndDelete({'_id':usuarioOTP._id})

    res.json({
        borrado
    })
}

const cambiarContraseniaOTP = async (req, res = response) =>
{
    const { correo, contrasenia } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        return res.status(400).json({ 
            msg: 'Correo no valido'
        });
    }
    const salt = bcryptjs.genSaltSync();
    usuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);
    await usuario.save();
    res.json({
        'msg': 'Ok'
    })
}



module.exports = {
    login,
    verificarSesion,
    generarOTP,
    verificaOTP,
    cambiarContraseniaOTP
    // googleSignedIn
}
