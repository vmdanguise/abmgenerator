const fs = require('fs');
module.exports = function crearPlantilla3(esquema_db,tablename, updatetable, updatetablenonecolumn, updatetablewhere,
                                         columnsInsertFirst, columnsInsert, valuesInsertFirst, valuesInsert,
                                         deletesql, ifallselect,selectbuscar
                                          ) {
  fs.writeFile(`./generated${esquema_db}/route_models/` + tablename + '.js',
    `let express = require('express');
let router = express.Router();
var mysql = require('mysql');
const stringify = require("csv-stringify");
let ${tablename}_c = require('./../controllers/${tablename}_c');
var connection = require('./../conexion/conexion.js')
// About page route.
router.get('/', function (req, res, next) {
  sql = 'SELECT * from ${esquema_db}.${tablename}';
    connection.query(sql, function (err, result, rows) {
      if (err) {
        res.render('error',{layout:"default",erroresporparametro:err});
        return null;
      }
      res.render('${tablename}', {layout:"default", ${tablename}: result,token: req.query.token });
    });
});
router.post('/update_${tablename}', async function (req, res) {
  
  var tool = new  ${tablename}_c();
  // aqui hacemos calculos y lo que sea
  req = await  tool.getReqEquals(req);

  let sql = 'UPDATE ${esquema_db}.${tablename} SET ${updatetablenonecolumn} ${updatetable} WHERE ${updatetablewhere}'; 
   connection.query(sql, function (err, result, rows) {
     if (err) {
       res.render('error',{layout:"default",erroresporparametro:err});
       return null;
     }
     sql = 'SELECT * from ${esquema_db}.${tablename}';
     connection.query(sql, function (err, result, rows) {
       if (err) {
         res.render('error',{layout:"default",erroresporparametro:err});
         return null;
       }
       res.send( JSON.stringify(result) );
     });
   })
 });
router.post('/insert_${tablename}', function (req, res) {
  let sql = 'INSERT INTO ${esquema_db}.${tablename} (${columnsInsertFirst} ${columnsInsert}) values (${valuesInsertFirst} ${valuesInsert})';
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error',{layout:"default",erroresporparametro:err});
      return null;
    }
    sql = 'SELECT * from ${esquema_db}.${tablename}';
    connection.query(sql, function (err, result, rows) {
      if (err) {
        res.render('error',{layout:"default",erroresporparametro:err});
        return null;
      }
      res.send( JSON.stringify(result) );
    });
  })
});
router.post('/delete_${tablename}', function (req, res) {
  let sql = 'DELETE from ${esquema_db}.${tablename} WHERE ${deletesql} = "' + req.body.${deletesql} + '"';
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error',{layout:"default",erroresporparametro:err});
      return null;
    }
    sql = 'SELECT * from ${esquema_db}.${tablename}';
    connection.query(sql, function (err, result, rows) {
      if (err) {
        res.render('error',{layout:"default",erroresporparametro:err});
        return null;
      }
      res.send( JSON.stringify(result) );

    });
  })
});
router.post('/select_${tablename}', function (req, res) {
  let sql;
  if (1 == 1 ${ifallselect}) {
    sql = 'SELECT * from ${esquema_db}.${tablename}';
  } else {
    sql = 'SELECT * from ${esquema_db}.${tablename} WHERE 1=1 ${selectbuscar};'
  }
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error',{layout:"default",erroresporparametro:err});
      return null;
    }
    res.send( JSON.parse(JSON.stringify(result)) );
  })
});

router.post('/imprimir_${tablename}', function (req, res) {
  let sql;
  if (1 == 1 ${ifallselect}) {
    sql = 'SELECT * from ${esquema_db}.${tablename}';
  } else {
    sql = 'SELECT * from ${esquema_db}.${tablename} WHERE 1=1 ${selectbuscar};'
  }
  connection.query(sql, function (err, result, rows) {
    if (err) {
      res.render('error',{layout:"default",erroresporparametro:err});
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
};
