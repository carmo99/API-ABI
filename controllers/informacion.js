const { response } = require('express');
const path = require('path');
const Informacion = require('../models/informacion');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const subirInformacion = async (req, res= response) =>{

    const { titulo, contenido, clasificacion} = req.body;
    const informacion = new Informacion({titulo, contenido, clasificacion});
    await informacion.save(); 

    res.json({
        informacion
    });
}

const subirFotoInfo = async (req, res = response) => {
    const {id} = req.params;

    const informacion = await Informacion.findById(id);
    
    //Limpiar imagene previas
    if ( informacion.foto ) {
        const nombreArr = informacion.foto.split('/');
        const nombre    = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id);
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url }= await cloudinary.uploader.upload( tempFilePath );
    
    informacion.foto = secure_url;

    await informacion.save();

    res.json({
        informacion
    })
}

const obtenerNoticia = async (req, res = response) =>
{
    const {id} =  req.params;
    const {titulo, contenido, foto} = await Informacion.findById( id );
    res.json({
        titulo, contenido, foto
    });
}

const obtenerNoticias = async (req, res = response) =>
{
    const {clasificacion} =  req.params;
    const {limite = 5, desde=0} = req.query;
    const query = {clasificacion} //Extraemos solo los usuarios activos

    const [ total, noticias ] = await Promise.all([
        Informacion.countDocuments(query),
        Informacion.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    //const {titulo, contenido, foto} = await Informacion.findById( id );
    res.json({
        total, noticias
    });
}

module.exports = {
    subirInformacion, 
    subirFotoInfo,
    obtenerNoticia,
    obtenerNoticias
}