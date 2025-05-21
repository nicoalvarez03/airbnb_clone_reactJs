// Creación de una API REST con Express y CORS para pruebas de conexion con el front-end
const express = require('express'); // Importamos express para crear el servidor
const cors = require('cors'); // Importamos cors para permitir peticiones desde el front-end
const { default: mongoose } = require('mongoose'); // Importamos mongoose para conectarnos a la base de datos
const User = require('./models/User'); // Importamos el modelo de usuario
const Place = require('./models/Place'); // Importamos el modelo de lugar
const Booking = require('./models/Booking'); // Importamos el modelo de reserva
const cookieParser = require('cookie-parser'); // Importamos cookie-parser para manejar cookies
const bcrypt = require('bcryptjs'); // Importamos bcrypt para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Importamos jwt para crear tokens de autenticación
const imageDownloader = require('image-downloader'); // Importamos image-downloader para descargar imágenes
const multer = require('multer'); // Importamos multer para subir archivos
const fs = require('fs'); // Importamos fs para manejar archivos

require('dotenv').config() // Importamos dotenv para cargar variables de entorno
const app = express(); // Creamos el servidor

const bcryptSalt = bcrypt.genSaltSync(10); // Creamos una sal para encriptar contraseñas
const jwtSecret = 'jkashdjkadkjad'; // Creamos una clave secreta para firmar los tokens

app.use(express.json()); // Le decimos a express que vamos a usar JSON
app.use(cookieParser()); // Le decimos a express que vamos a usar cookies
app.use('/uploads', express.static(__dirname + '/uploads')); // Le decimos a express que vamos a servir archivos estáticos
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
})); // Le decimos a cors que permita peticiones desde el front-end

mongoose.connect(process.env.MONGO_URL); // Nos conectamos a la base de datos

// Creamos una ruta de prueba para verificar que la API funciona
app.get('/test', (req, res) => {
    res.json('test ok');
});

// Creamos una funcion para obtener los datos del usuario a partir del token
function getUserDataFromReq(req){
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            resolve(userData);
        });
    });
}

// Creamos una ruta para registrar un usuario
app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const userDoc = await User.create({
            name, 
            email, 
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }catch(e){
        res.status(422).json(e);
    }
});

// Creamos una ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const {email, password} = req.body; 
    const userDoc = await User.findOne({email}); 
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({
                email:userDoc.email, 
                id:userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if(err){
                    res.status(422).json('error signing token');
                }else{
                    res.cookie('token', token).json(userDoc);
                }
            });
        }else{
            res.status(422).json('password incorrect');
        }
    }else{
        res.status(422).json('not found')
    }
});

// Creamos una ruta para obtener el perfil del usuario
app.get('/profile', async (req, res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(userData.id)
            res.json({name, email, _id});
        });
    }else{
        res.json(null);
    }
});

// Creamos una ruta para cerrar sesión
app.post('/logout', (req, res) => {
    res.clearCookie('token').json(true);
});

// Creamos una ruta para subir una imagen desde el formulario de alojamientos
app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    try{
        const newName = 'photo' + Date.now() + '.jpg';
        await imageDownloader.image({
            url: link,
            dest: __dirname+'/uploads/' + newName,
        });
        res.json(newName);
    }catch(err){
        res.status(422).json(err);
    }
});

// Creamos una ruta para subir varias imágenes
const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for(let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
        console.log(newPath)
    }
    res.json(uploadedFiles)
});

// Creamos una ruta para crear un alojamiento nuevo
app.post('/places', (req, res) => {
    const {token} = req.cookies;
    const {
        title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        });
        res.json(placeDoc);
    });
});

// Creamos una ruta para obtener los alojamientos del usuario autenticado
app.get('/user-places', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        const {id} = userData;
        res.json(await Place.find({owner: id}));
    });
})

// Creamos una ruta para obtener un alojamiento por su id
app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
});

// Creamos una ruta para actualizar un alojamiento
app.put('/places', async (req, res) => {
    const {token} = req.cookies;
    const {
        id, title, address, addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price,
    } = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            console.log({price});
            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price,
            });
            await placeDoc.save();
            res.json('Updated successfully');
        }
    });
});

// Creamos una ruta para mostrar todos los alojamientos
app.get('/places', async (req, res) => {
    res.json(await Place.find());
});

//Creamos un endpoint para guardar una reserva
app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, 
        checkIn, 
        checkOut, 
        numberOfGuests, 
        name, 
        phone,
        price,
    } = req.body;
    Booking.create({
        place, 
        checkIn, 
        checkOut, 
        numberOfGuests, 
        name, 
        phone,
        price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        res.status(422).json(err);
    });
});

// Creamos una ruta para obtener las reservas del usuario autenticado
app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({user: userData.id}).populate('place'));
});

// Creamos una ruta para eliminar una reserva
app.delete('/bookings/:id', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const { id } = req.params;
  
    try {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      if (booking.user.toString() !== userData.id) {
        return res.status(403).json({ error: 'No autorizado' });
      }
  
      await booking.deleteOne();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
  });



app.listen(4000);