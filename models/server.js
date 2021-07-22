const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload');

class Server{
    constructor()
    {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth : '/api/auth',
            premium: '/api/premium',
            categorias: '/api/categorias',
            informacion: '/api/informacion',
            productos: '/api/productos',
            usuarios : '/api/usuarios',
            uploads : '/api/uploads',
        }
        
        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() 
    {
        await dbConnection();
    }

    middlewares()
    {
        //cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use(express.json());

        //Directorio público
        this.app.use(express.static('public'));
        
        //Manejar carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }

    routes()
    {
        this.app.use(this.paths.auth, require('../routes/auth'));
    //    this.app.use(this.paths.buscar, require('../routes/buscar'));
    //    this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.informacion, require('../routes/informacion'));
        this.app.use(this.paths.premium, require('../routes/premium'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    //    this.app.use(this.paths.uploads, require('../routes/uploads'));    
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto: ', this.port);
        })
    }
}
module.exports = Server;