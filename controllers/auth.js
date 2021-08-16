
const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

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

module.exports = {
    login,
    verificarSesion
    // googleSignedIn
}
