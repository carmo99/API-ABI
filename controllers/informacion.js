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
    
    let carpeta;
    if (informacion.clasificacion === 'I_LEGAL' ) {
        carpeta = 'FotoInfoLegal';
    }else{
        carpeta = 'FotoInfoDia';
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url }= await cloudinary.uploader.upload( tempFilePath, {folder: carpeta} );
    
    informacion.foto = secure_url;

    await informacion.save();

    res.json({
        informacion
    })
}

module.exports = {
    subirInformacion, 
    subirFotoInfo
}