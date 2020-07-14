var mysql = require('mysql');
var connection = require('./conexion.js');
var fileCrearHBS = require('./plantillas/plantilla_hbs.js');
var fileCrearVistaJs = require('./plantillas/plantilla_v.js');
var fileCrearJS = require('./plantillas/plantilla.js');
var crearPlantillaMenu = require('./plantillas/plantilla_menu.js');
var crearPlantillaIndex = require('./plantillas/plantilla_index.js');
var crearPlantillaComplementaria = require('./plantillas/plantilla_complementaria.js');




//createABM();

module.exports = async function createABM(esquema_db,host,usuario,password) {
/*
SELECT  *
    FROM INFORMATION_SCHEMA.COLUMNS C 
    JOIN information_schema.key_column_usage K ON C.TABLE_NAME = K.TABLE_NAME and C.COLUMN_NAME = K.COLUMN_NAME
    WHERE C.TABLE_SCHEMA = 'new_schema' AND
    C.COLUMN_KEY = 'PRI' 
AND K.REFERENCED_TABLE_NAME IS NOT NULLs
*/


    var sql = `SELECT C.TABLE_NAME, C.COLUMN_NAME, K.REFERENCED_TABLE_NAME, K.REFERENCED_COLUMN_NAME, C.COLUMN_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS C 
    LEFT JOIN information_schema.key_column_usage K ON C.TABLE_NAME = K.TABLE_NAME and C.COLUMN_NAME = K.COLUMN_NAME
    and C.TABLE_SCHEMA = k.TABLE_SCHEMA AND K.REFERENCED_COLUMN_NAME IS NOT NULL
    WHERE C.TABLE_SCHEMA = '${esquema_db}';`;
    var sql2 = `SELECT distinct TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${esquema_db}';`;
    
    var tablename = '', encabezadoTabla = '', cuerpoTabla = '', inputForm = '', elementsByIds = '', elementsByIdsCancelar = '',
        tablaDinamica = '', tablaDinamicaRefresh = '', updatetable = '', updatetablewhere = '', updatetablenonecolumn = '',
        columnsInsertFirst = '', columnsInsert = '', valuesInsertFirst = '', valuesInsert = '',
        auxiliar = '', auxiliarLinks = '', deletesql = '', ifallselect = '', selectbuscar = '', column_reference = '';
    var child = 0;

    connection.query(sql2, function (err2, result2, fields2) {
        if (err2) {
            console.log(err2);
        }
        Object.keys(result2).forEach(function (key2) {
            sql = `SELECT DISTINCT C.TABLE_NAME, C.COLUMN_NAME, K.REFERENCED_TABLE_NAME, K.REFERENCED_COLUMN_NAME, C.COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS C 
            LEFT JOIN information_schema.key_column_usage K ON C.TABLE_NAME = K.TABLE_NAME and C.COLUMN_NAME = K.COLUMN_NAME
            and C.TABLE_SCHEMA = k.TABLE_SCHEMA AND K.REFERENCED_COLUMN_NAME IS NOT NULL
            WHERE C.TABLE_SCHEMA = '${esquema_db}'   AND C.TABLE_NAME = '${result2[key2].TABLE_NAME}' ORDER BY C.ORDINAL_POSITION;`;
            auxiliar = auxiliar +
                `\n var ${result2[key2].TABLE_NAME} = require('./route_models/${result2[key2].TABLE_NAME}.js'); \n app.use('/${result2[key2].TABLE_NAME}', rutasConToken, ${result2[key2].TABLE_NAME});`;
            auxiliarLinks = auxiliarLinks +
                `<li><a href="javascript:window.open('./${result2[key2].TABLE_NAME}?token={{token}}')"><span class="icon-mail"></span>${result2[key2].TABLE_NAME}</a></li> \n`

            updatetablenonecolumn = "";
            updatetablewhere = "";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log(err);
                }
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    tablename = row.TABLE_NAME;
                    // console.log(row.COLUMN_TYPE);
                    if (row.COLUMN_TYPE.toUpperCase().includes('DECIMAL')) { row.COLUMN_TYPE = 'number' }
                    else if (row.COLUMN_TYPE.toUpperCase().includes('DOUBLE')) { row.COLUMN_TYPE = 'number' }
                    else if (row.COLUMN_TYPE.toUpperCase().includes('INT')) { row.COLUMN_TYPE = 'number' }
                    else if (row.COLUMN_TYPE.toUpperCase().includes('DATE')) { row.COLUMN_TYPE = 'date' }
                    else if (row.COLUMN_TYPE.toUpperCase().includes('TINYINT')) { row.COLUMN_TYPE = 'checkbox' }
                    else { row.COLUMN_TYPE = 'text' }
                    child++;
                    encabezadoTabla = encabezadoTabla + `<td>${row.COLUMN_NAME}</td>`;
                    cuerpoTabla = cuerpoTabla + `<td align="center">{{${row.COLUMN_NAME}}}</td>`;

                    if (row.COLUMN_TYPE == 'checkbox') {
                        inputForm = inputForm + '<br><br><label for="' + row.COLUMN_NAME + '">' + row.COLUMN_NAME + '</label><select id="' + row.COLUMN_NAME + '" name="' + row.COLUMN_NAME + '"/><option value="1">Si</option><option value="0" selected>No</option></select>';
                    }
                    else {
                        inputForm = inputForm + '<br><br><label for="' + row.COLUMN_NAME + '">' + row.COLUMN_NAME + '</label><input type="' + row.COLUMN_TYPE + '" id="' + row.COLUMN_NAME + '" size="30" maxlength="30" name="' + row.COLUMN_NAME + '"/>'
                        if (row.REFERENCED_TABLE_NAME) {
                            inputForm = inputForm + `<a href="javascript:window.open('./${row.REFERENCED_TABLE_NAME}?token={{token}}')"><img src="https://img.icons8.com/color/50/000000/search.png" alt=".(+)."/></a>`;

                        }


                    }


                    elementsByIds = elementsByIds + ' +"&' + row.COLUMN_NAME + '=" + document.getElementById("' + row.COLUMN_NAME + '").value \n';
                    elementsByIdsCancelar = elementsByIdsCancelar + ' document.getElementById("' + row.COLUMN_NAME + '").value = ""; \n';
                    tablaDinamica = tablaDinamica + '<td>${valor.' + row.COLUMN_NAME + '}</td>         \n';

                    if (row.COLUMN_TYPE == 'date') {
                        tablaDinamicaRefresh = tablaDinamicaRefresh + ' let dato' + row.COLUMN_NAME + ' = $(this).find("td:nth-child(' + child + ')").html(); $("#' + row.COLUMN_NAME + '").val(moment(dato' + row.COLUMN_NAME + ').format("YYYY-MM-DD"));  \n';

                    }
                    else {
                        tablaDinamicaRefresh = tablaDinamicaRefresh + ' let dato' + row.COLUMN_NAME + ' = $(this).find("td:nth-child(' + child + ')").html(); $("#' + row.COLUMN_NAME + '").val(dato' + row.COLUMN_NAME + ');  \n';

                    }

                    //   let datonacimiento = $(this).find("td:nth-child(5)").html();$("#nacimiento").val(moment(datonacimiento).format("YYYY-MM-DD"));  


                    ifallselect = ifallselect + ` && req.body.${row.COLUMN_NAME} == '' `;
                    selectbuscar = selectbuscar + ` and ${row.COLUMN_NAME} like "%' + req.body.${row.COLUMN_NAME} + '%" `;
                    if (child == 1) {
                        updatetablenonecolumn = `${row.COLUMN_NAME}="'+req.body.${row.COLUMN_NAME}+'"`;
                        updatetablewhere = `${row.COLUMN_NAME}="'+req.body.${row.COLUMN_NAME}+'"`;
                        valuesInsertFirst = `"'+req.body.${row.COLUMN_NAME}+'"`;
                        columnsInsertFirst = `${row.COLUMN_NAME}`;
                        deletesql = `${row.COLUMN_NAME}`;
                        column_reference = `${row.COLUMN_NAME}`;

                    }
                    else {
                        updatetable = updatetable + `,${row.COLUMN_NAME}="'+req.body.${row.COLUMN_NAME}+'"`;
                        columnsInsert = columnsInsert + ',' + row.COLUMN_NAME + ' ';
                        valuesInsert = valuesInsert + ',"\' + req.body.' + row.COLUMN_NAME + ' + \'"';
                    }

                });

                fileCrearHBS(esquema_db,tablename, encabezadoTabla, cuerpoTabla, inputForm, column_reference);
                fileCrearVistaJs(esquema_db,tablename, elementsByIds, elementsByIdsCancelar, tablaDinamica, tablaDinamicaRefresh);
                fileCrearJS(esquema_db,tablename, updatetable, updatetablenonecolumn, updatetablewhere,
                    columnsInsertFirst, columnsInsert, valuesInsertFirst, valuesInsert,
                    deletesql, ifallselect, selectbuscar);
                encabezadoTabla = "";
                cuerpoTabla = "";
                inputForm = "";
                elementsByIds = "";
                elementsByIdsCancelar = "";
                tablaDinamica = "";
                tablaDinamicaRefresh = "";
                updatetable = "";
                columnsInsertFirst = "";
                columnsInsert = "";
                valuesInsertFirst = "";
                valuesInsert = "";
                deletesql = "";
                ifallselect = "";
                selectbuscar = "";
                column_reference = "";
                child = 0;
            });


        })
        crearPlantillaIndex(esquema_db,auxiliar);
        crearPlantillaMenu(esquema_db,auxiliarLinks);
        crearPlantillaComplementaria(esquema_db,host,usuario,password);
        console.log("Terminado");
    })
}


