const abm = require('./generadorABM.js')
var express = require('express');
var app = express();

var archiver = require('archiver'),
    fs = require('fs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html"
    );
});


app.get('/crearConexion', function (req, res) {
    fs.writeFile('./conexion.js',
        `
var mysql = require('mysql');
var connection;
connection = mysql.createConnection({
  host: '${ req.query.host}',
  port: 3306,
  user: '${ req.query.user}',
  password: '${ req.query.password}',
  database: '${ req.query.esquema}',
  insecureAuth: 'true'
});
module.exports = connection;
`
        , error => { if (error) console.log(error); });


    res.send("Ejecutar generarABM");
});

app.get('/crearTableUsuarios', function (req, res) {
    var connection = require('./conexion.js')
        sql = `CREATE TABLE IF NOT EXISTS usuarios (
            usuario varchar(8) NOT NULL,
            contrasena varchar(45) DEFAULT NULL,
            rol varchar(45) DEFAULT NULL,
            nacimiento date DEFAULT NULL,
            dni int DEFAULT NULL,
            sexo tinyint DEFAULT NULL,
            PRIMARY KEY (usuario)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
           ;`;
        connection.query(sql, function (err, result, rows) {
            if (err) {
                console.log(err);
                return null;
            }
            sql = `INSERT INTO ${ req.query.esquema}.usuarios (usuario,contrasena,rol,nacimiento,dni,sexo) VALUES ('admin', 'admin', 'SuperAdmin', '1984-01-01', '11111111', '1');`;
            connection.query(sql, function (err, result, rows) {
                if (err) {
                    console.log(err);
                        return null;
                }
            });
    });
    res.send("Creado Usuarios");
});

app.get('/estructurar', function (req, res) {
    var dir = `./generated${req.query.esquema}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/conexion`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/configs`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/controllers`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/db`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/public`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/public/css`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/public/js`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/route_models`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/views`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/views/html`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/views/pages`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    dir = `./generated${req.query.esquema}/views/partials`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }


    res.send("Ejecutar crearConexion");
});

app.get('/finalizarProceso', function (req, res) {
    try {
        fs.unlinkSync(`./outputZip/generated${req.query.esquema}.zip`);
    } catch (err) { };
    res.send("Ejecutar finalizarProceso");
});


app.get('/generarABM', function (req, res) {
    abm(req.query.esquema, req.query.host, req.query.user, req.query.password);
    res.send("Ejecutar comprimir");
});

app.get('/downloadZip', function (req, res) {
    res.sendFile(__dirname + `/outputZip/generated${req.query.esquema}.zip`);
    const rimraf = require('rimraf');
    rimraf.sync(`./generated${req.query.esquema}`);
});


app.get('/comprimir', function (req, res) {
    /**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
    zipDirectory(`./generated${req.query.esquema}`, `./outputZip/generated${req.query.esquema}.zip`).then(responder());
    function zipDirectory(source, out, ) {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fs.createWriteStream(out);

        return new Promise((resolve, reject) => {
            archive
                .directory(source, false)
                .on('error', err => reject(err))
                .pipe(stream)
                ;

            stream.on('close', () => resolve());
            archive.finalize();
        });
    }
    function responder() { res.send("Archivo creado utilice download para bajarlo") };
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Example app listening on port 3000! or ' + PORT);
});
