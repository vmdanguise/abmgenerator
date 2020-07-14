const fs = require('fs');
module.exports = function crearPlantillaComplementaria(esquema_db,host,usuario,password) {
 


  fs.writeFile(`./generated${esquema_db}/conexion/conexion.js`,
      `
var mysql = require('mysql');

var connection;
if (!process.env.PORT) {
  connection = mysql.createConnection({
    host: '${host}',
    port: 3306,
    user: '${usuario}',
    password: '${password}',
    database: '${esquema_db}',
    insecureAuth: true
  });
}
else {
  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: '${usuario}',
    password: '${password}',
    database: '${esquema_db}',
    insecureAuth: 'true'

  });

}

module.exports = connection;
`
      , error => { if (error) console.log(error); });


fs.writeFile(`./generated${esquema_db}/configs/config.js`,
   `
module.exports = {
   llave: "miclaveultrasecreta123*"
}
`
   , error => { if (error) console.log(error); });


fs.writeFile(`./generated${esquema_db}/controllers/mailer.js`,
   `
var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function (link, mail) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mail@gmail.com',
            pass: 'password'
        }
    });
    // Definimos el email
    var mailOptions = {
        from: 'Sistema',
        to: mail,
        subject: 'Acceso a sistema',
        text: link
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent");
           
        }
    });
};
`
   , error => { if (error) console.log(error); });



fs.writeFile(`./generated${esquema_db}/db/creacionTables.sql`,
   `
CREATE SCHEMA ${esquema_db} ;

CREATE TABLE IF NOT EXISTS usuarios (
  usuario varchar(8) NOT NULL,
  contrasena varchar(45) DEFAULT NULL,
  rol varchar(45) DEFAULT NULL,
  nacimiento date DEFAULT NULL,
  dni int DEFAULT NULL,
  sexo tinyint DEFAULT NULL,
  PRIMARY KEY (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

INSERT INTO ${esquema_db}.usuarios (usuario,contrasena,rol,nacimiento,dni,sexo) VALUES ('admin', 'admin', 'SuperAdmin', '01-02-1984', '11111111', '1');
`
   , error => { if (error) console.log(error); });

fs.writeFile(`./generated${esquema_db}/public/css/estilo.css`,
`
input[type=submit],
input[type=button]{
  background: #EB3B88;
  border: 1px solid #C94A81;
  padding: 5px 15px 5px 15px;
  color: #FFCBE2;
  box-shadow: inset -1px -1px 3px #FF62A7;
  -moz-box-shadow: inset -1px -1px 3px #FF62A7;
  -webkit-box-shadow: inset -1px -1px 3px #FF62A7;
  border-radius: 3px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;	
  font-weight: bold;
    
}
.required{
  color:red;
  font-weight:normal;
}

fieldset{
  padding: 10px;
}

input{
  background: rgb(59, 194, 235);
  border: 1px solid rgb(74, 201, 85);
  padding: 5px 15px 5px 15px;
  color: rgb(12, 10, 11);
  box-shadow: inset -1px -1px 3px rgb(98, 242, 255);
  -moz-box-shadow: inset -1px -1px 3px rgb(98, 114, 255);
  -webkit-box-shadow: inset -1px -1px 3px rgb(98, 166, 255);
  border-radius: 3px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;	
  font-weight: bold;
}

body
{
background-color : black;
color: white;
padding: 30px;
}

input:invalid {
   border: 2px solid red;
 }
 
 input:valid {
   border: 2px solid green;
 }

 * {
   padding:0;
   margin:0;
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
   list-style:none;
text-decoration:none;
 }
   

 div {
   margin: .4em 0;
 }
 div label {
   width: 25%;
   float: left;
 }

 .enlace {
   border: 0;
   padding: 0;
   background-color: transparent;
   color: blue;
   border-bottom: 1px solid blue;
 }
 
 form.elegante input {
   padding: .2em;
 }

 label{
   display: inline-block;
   width: 150px;
   padding: 10px;
 }
 
 .btn{
   width:150px; height:25px; padding: 10px;
 }

 form {
   width: 100%;
   padding: 10px;
 }
   


 .nav > li {
  float:left;
  }
   
  .nav li a {
  background:#0c9ba0;
  color:#FFF;
  display:block;
  border:1px solid;
  padding:10px 12px;
  }
   
  .nav li a:hover {
  background:#0fbfc6;
  }
  
  .nav li ul {
  display:none;
  position:absolute;
  min-width:140px;
  }
  
  .nav li:hover > ul {
  display:block;
  }
  
  .nav li ul li {
  position:relative;
  }
   
  .nav li ul li ul {
  right:-140px;
  top:0;
  }  

`
   , error => { if (error) console.log(error); });



fs.writeFile(`./generated${esquema_db}/public/js/menu.js`,
   `
       falta el js del menu para movil
         `
   , error => { if (error) console.log(error); });


fs.writeFile(`./generated${esquema_db}/public/js/moment.js`,
   `
      includde('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js');
      `
   , error => { if (error) console.log(error); });

fs.writeFile(`./generated${esquema_db}/route_models/consultaPersonalizada.js`,
   `
      let express = require('express');
      let router = express.Router();
      var mysql = require('mysql');
      const stringify = require("csv-stringify");
      
      const fs = require("fs");
      
      var connection = require('./../conexion/conexion.js')
      
      
      //select filter
      
      router.get('/', function (req, res) {
        res.render('consultaPersonalizada', {layout:"default", token: req.query.token });
      });
      
      router.post('/sql', function (req, res) {
        let sql = req.body.consulta;
        connection.query(sql, function (err, result, rows) {
          if (err) {
            res.render('error', {layout:"default", erroresporparametro: err });
            return null;
          }
          const jsonData = JSON.parse(JSON.stringify(result));
          stringify(jsonData, { header: true })
          .pipe(res);
          
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' +sql + Date.now() + '.csv\"');
        })
      
      });
      
      
      
      module.exports = router;
      `
   , error => { if (error) console.log(error); });



fs.writeFile(`./generated${esquema_db}/views/pages/default.hbs`,
   `
      <!DOCTYPE html>
      <html lang="es">
      <head>
         <meta charset="UTF-8">
         <title>${esquema_db}!</title>
         <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
         <link rel="stylesheet" href="../public/css/estilo.css">
         <link rel="stylesheet" href="../public/css/fonts.css">
         <script src="https://code.jquery.com/jquery-latest.js"></script>
      </head>
      <body>
       {{{body}}}
      </body>
      </html>
      
               `
   , error => { if (error) console.log(error); });



fs.writeFile(`./generated${esquema_db}/views/consultaPersonalizada.hbs`,
   `
      <form>
      <fieldset width="100">
        <legend>Consulta Personalizada</legend>
        <br><br>
         <label for="Consulta">Consulta</label>
        <input type="text" id="consulta" size="500" name="consulta" />
        <br>
        <input class="btn" type="submit" value="Consultar" formaction="/consultas/sql?token={{token}}" formmethod="POST" />
        </fieldset>
    </form>
     `
   , error => { if (error) console.log(error); });


fs.writeFile(`./generated${esquema_db}/views/error.hbs`,
   `
         Error: {{erroresporparametro}}
         <br><a href="/"><span class="icon-house"></span>Inicio</a>
           
  `
   , error => { if (error) console.log(error); });


fs.writeFile(`./generated${esquema_db}/views/login.hbs`,
   `
         <style type="text/css">
         *{box-sizing: border-box;margin: 0;padding: 0; outline: none; transition: all 0.3s ease; animation-delay: 0s;}
       
       body {
         background: #74ebd5;
         background: -webkit-linear-gradient(to bottom, #74ebd5, #acb6e5);
         background: linear-gradient(to bottom, #74ebd5, #acb6e5);
         font-size: 16px;
         line-height: 1.2;
         color: #888;
       }
       
       .pagewrap {max-width: 100%; height: 100vh; margin: 0 auto; display: flex; justify-content: center; align-items: center;}
       
       .form {
         width: 90%;
         height: 300px;
         display: flex;
         align-items: center;
         justify-content: center;
         flex-flow: column wrap;
         background-color: #ecedee;
         border-radius: 5px;
         
         @media (min-width: 600px) {
           max-width: 380px;
         }
         
         @media (min-width: 980px) and (max-width: 1400px) {
           width: 35%;
         }
         
         &__title {
          margin-bottom: 1em;
          position: relative;
          z-index: 2;
          background: transparent;
                text-transform: uppercase;
         }
         
         &__submit {
           margin-top: 1.2em;
           border: none;
           padding: .90em;
           background-color: skyblue;
           color: #fff;
           letter-spacing: 1.2px;
           font-size: .98rem;
           text-transform: uppercase;
           box-shadow: -3px 5px darken(skyblue, 10%);
           cursor: pointer;
                   transition: all 0s ease;
                
                   &.clicked {
                      position: relative;
                      top: 10px;
                      left: -3px;
                      box-shadow: 0px 0px;
                   }
          }
       }
       
       .container {
         position: relative;
         width: 90%;
         height: 15%;
         margin-top: 1em;
         
         &__input {
         width: 100%;
         height: 100%;
         padding: 1em;
         border: 3px solid #fff;
         background-color: transparent;
         color: #666;
         font-weight: bold;
       
           &:first-of-type {
             margin-bottom: 1em;
           }
           
                 &:focus + label,
           &:valid + label {
             top: -8px;
             left: 3px;
             width: 30%;
             height: 10%;
             padding: .80em 3.5em;
           }
         }
         
         &__label {
         position: absolute;
         top: -8px;
         left: 3px;
         width: 30%;
         height: 10%;
         padding: .80em 3.5em;
         background-color: skyblue;
         display: flex;
         justify-content: center;
         align-items: center;
         color: #fff;
         text-transform: uppercase;
         font-size: .80rem;  
         
         @media (min-width: 500px) {
             top: 3px;
             left: 3px;
             height: 86%;
             padding: 0;
           }
         }
       }
       </style>
       
       <script>
           function validate() {
       var username = document.getElementById('username').value;
       var password = document.getElementById('pass').value;
          
         if (username === "" || username === null) {
           intensify($('#userLabel'));
                   return false;
         }
         
         if (password === "" || password === null) {
                 intensify($('#passLabel'));
                   return false;
         }
       }
       
       function intensify(intense) {
          intense.addClass('animated shakeit').delay(6000).queue(function(){
                      intense.removeClass('animated shakeit').dequeue();
                   });
       }
       
       function clicked() {
          $('button').addClass('clicked').delay(200).queue(function(){
             $('button').removeClass('clicked').dequeue();
          });
       }
       
       </script>
       <img src="https://img.icons8.com/material-outlined/50/000000/key.png"/>
       <div class="pagewrap">
         <form class="form" id="form">
           <h3 class="form__title">Login</h3>
           <div class="container">
             <input class="container__input" type="text" id="usuario" name="usuario" value="" required>
             <label id="userLabel" for="username" class="container__label">Username</label>
           </div>
           <div class="container">
             <input class="container__input" type="password" id="contrasena" name="contrasena" value="" required>
             <label id="passLabel" for="pass" class="container__label">Password</label>
           </div>
           <button class="form__submit" type="submit" value="Ingresar" formaction="/autenticar" formmethod="POST">Ingresar</button>
             <!--input class="btn" type="submit" value="Ingresar" formaction="/autenticar2Factor" formmethod="POST" /-->
         </form>
       </div>
  `
   , error => { if (error) console.log(error); });

fs.writeFile(`./generated${esquema_db}/procfile`,
   `web: node index.js`
   , error => { if (error) console.log(error); });

fs.writeFile(`./generated${esquema_db}/package.json`,
   `{
      "name": "sistemaabm",
      "version": "1.0.0",
      "engines": {
        "node": "12.13.0",
        "npm": "6.13.4"
      },
      "description": "",
      "main": "index.js",
      "scripts": {
        "start": "node index.js",
        "test": "echo 'Error: no test specified' && exit 1"
      },
      "author": "vmd",
      "license": "ISC",
      "dependencies": {
        "body-parser": "^1.19.0",
        "csv-stringify": "^5.3.6",
        "express": "^4.17.1",
        "express-hbs": "^2.3.0",
        "jsonwebtoken": "^8.5.1",
        "mysql": "^2.18.1",
        "nodemailer": "^6.4.3"
      }
    }
    `
   , error => { if (error) console.log(error); });  
   };
