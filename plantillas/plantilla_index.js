const fs = require('fs');
module.exports = function crearPlantillaIndex(esquema_db,auxiliar) {
  fs.writeFile(`./generated${esquema_db}/index.js`,
`//ayuda para el enrutador
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var connection = require('./conexion/conexion.js')

var consultaPersonalizada = require('./route_models/consultaPersonalizada.js');
const hbs = require('express-hbs');
const jwt = require('jsonwebtoken');
const config = require('./configs/config');
const rutasConToken = express.Router();
var EmailCtrl = require('./controllers/mailer.js');
var PORT = process.env.PORT || 8000;
var URL = 'http://localhost:';

/*app.use(function (req, res, next) {
  console.log('Time rquest:', Date.now(),  req.json());
  next();
});
*/
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('llave', config.llave);

app.engine('hbs', hbs.express4({
  defaultView: 'default',
  layoutsDir: __dirname + '/views/pages/',
  partialsDir: __dirname + '/views/partials/'

}));
app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');

rutasConToken.use((req, res, next) => {
  const token = req.headers['access-token'] || req.query.token || req.body.token;

  if (token) {
    jwt.verify(token, app.get('llave'), (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token inválida' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: 'Token no proveída.'
    });
  }
});

// espacio para agregar routing    

${auxiliar}

//no tocar para abajo
app.use('/consultas', rutasConToken, consultaPersonalizada);

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {

  res.render('login', { layout: "default" });
})


// Home page route.
app.post('/menu', function (req, res) {
  res.render('menu', { layout: "default", token: req.query.token });
})

// Home page route.
app.get('/menu', function (req, res) {
  res.render('menu', { layout: "default", token: req.query.token });
})




app.post('/autenticar', (req, res) => {
  sql = 'SELECT * from ${esquema_db}.usuarios where usuario = "' + req.body.usuario + '" and contrasena = "' + req.body.contrasena + '"';
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error', { layout: "default", erroresporparametro: err });
      return null;
    }
    Object.keys(result).forEach(function (key) {
      var row = result[key];
      const payload = {
        check: true
      };
      function genToken(callback) {
        const token = jwt.sign(payload, app.get('llave'), {
          expiresIn: 1440
        });
        callback(token);
      };
      genToken(function renderizar(valor) {
        if (row.rol == 'SuperAdmin') { res.render('menuSuperAdmin', { layout: "default", token: valor }); }
        else if (row.rol == 'Admin') { res.render('menuAdmin', { layout: "default", token: valor }); }
        else if (row.rol == 'normal') { res.render('menu', { layout: "default", token: valor }); }
      });
    })
    res.render('error', { layout: "default", erroresporparametro: "Usuario o contraseña incorrectos" });
  });


});

app.post('/autenticar2Factor', (req, res) => {
  sql = 'SELECT * from ${esquema_db}.usuarios where usuario = "' + req.body.usuario + '" and contrasena = "' + req.body.contrasena + '"';
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error', { layout: "default", erroresporparametro: err });
      return null;
    }
    Object.keys(result).forEach(function (key) {
      var row = result[key];
      const payload = {
        check: true
      };
      function genToken(callback) {
        const token = jwt.sign(payload, app.get('llave'), {
          expiresIn: 1440
        });
        callback(token);
      };
      genToken(function sendMail(valor) {
        if (row.rol == 'SuperAdmin') { EmailCtrl.sendEmail("https://" + req.hostname + ":" + PORT + '/menuSuperAdmin?token=' + valor, req.body.usuario); }
        else if (row.rol == 'Admin') { EmailCtrl.sendEmail("https://" + req.hostname + ":" + PORT + '/menuAdmin?token=' + valor, req.body.usuario); }
        else if (row.rol == 'normal') {
          EmailCtrl.sendEmail("https://" + req.hostname + ":" + PORT + '/menu?token=' + valor, req.body.usuario);
        }
        res.status(200).send("Acceda a su mail para ingresar....");
      });
    })
    res.render('error', { layout: "default", erroresporparametro: "Usuario o contraseña incorrectos" });
  });
});


// error para recurso no actualiazado
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //  next(err);
  res.render('error', { erroresporparametro: err });
});


app.listen(PORT);


console.log("Server Corriendo: " + URL + PORT + "/");

module.exports = app;
`
    , error => { if (error) console.log(error); });
};

