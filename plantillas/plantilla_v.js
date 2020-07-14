const fs = require('fs');
module.exports = function crearPlantilla2(esquema_db,tablename, elementsByIds, elementsByIdsCancelar, tablaDinamica,tablaDinamicaRefresh) {
  fs.writeFile(`./generated${esquema_db}/public/js/` + tablename + '_v.js',
    'function insertar_' + tablename + '() {                                     \n' +
    '    var r = confirm("Confirma??");                                          \n' +
    '    if (r == true) {                                                        \n' +
    '        fetch("/' + tablename + '/insert_' + tablename + '", {              \n' +
    '            method: "POST",                                                 \n' +
    '            headers: {                                                      \n' +
    '                "Content-Type": "application/x-www-form-urlencoded"         \n' +
    '            },                                                              \n' +
    '            body: "token=" + document.getElementById("token").value         \n' +
    elementsByIds +
    '        })                                                                  \n' +
    '            .then(function (response) {                                     \n' +
    '                return response.json();                                     \n' +
    '            })                                                              \n' +
    '            .then(function (data) {                                         \n' +
    '                alert("Alta Ok:" + data);                                   \n' +
    '            })                                                              \n' +
    '            .catch(function (err) {                                         \n' +
    '                alert("Alta NOk:" + data);                                  \n' +
    '            })                                                              \n' +
    '            .finally(function () {                                          \n' +
    '                cancelar();                                                 \n' +
    '            });                                                             \n' +
    '    } else {                                                                \n' +
    '        null;                                                               \n' +
    '    }                                                                       \n' +
    '}                                                                           \n' +
    'function update_' + tablename + '() {                                             \n' +
    '    var r = confirm("Confirma??");                                          \n' +
    '    if (r == true) {                                                        \n' +
    '        fetch("/' + tablename + '/update_' + tablename + '", {              \n' +
    '            method: "POST",                                                 \n' +
    '            headers: {                                                      \n' +
    '                "Content-Type": "application/x-www-form-urlencoded"         \n' +
    '            },                                                              \n' +
    '             body: "token=" + document.getElementById("token").value        \n' +
    elementsByIds +
    '	    })                                                                   \n' +
    '            .then(function (response) {                                     \n' +
    '                return response.json();                                     \n' +
    '            })                                                              \n' +
    '            .then(function (data) {                                         \n' +
    '                alert("Modificado Ok:" + data);                             \n' +
    '            })                                                              \n' +
    '            .catch(function (err) {                                         \n' +
    '                alert("Modificado NOk:" + data);                            \n' +
    '            })                                                              \n' +
    '            .finally(function () {                                          \n' +
    '                cancelar();                                                 \n' +
    '            });                                                             \n' +
    '    } else {                                                                \n' +
    '        null;                                                               \n' +
    '    }                                                                       \n' +
    '}   \n                                                                      \n' +
    'function delete_' + tablename + '() {                                             \n' +
    '    var r = confirm("Confirma??");                                          \n' +
    '    if (r == true) {                                                        \n' +
    '        fetch("/' + tablename + '/delete_' + tablename + '", {                          \n' +
    '            method: "POST",                                                 \n' +
    '            headers: {                                                      \n' +
    '                "Content-Type": "application/x-www-form-urlencoded"         \n' +
    '            },                                                              \n' +
    '           body: "token=" + document.getElementById("token").value          \n' +
    elementsByIds +
    '        })                                                                  \n' +
    '            .then(function (response) {                                     \n' +
    '                return response.json();                                     \n' +
    '            })                                                              \n' +
    '            .then(function (data) {                                         \n' +
    '            })                                                              \n' +
    '            .catch(function (err) {                                         \n' +
    '            })                                                              \n' +
    '            .finally(function () {                                          \n' +
    '                cancelar();                                                 \n' +
    '            });                                                             \n' +
    '    } else {                                                                \n' +
    '        null;                                                               \n' +
    '    }                                                                       \n' +
    '}                                                                           \n' +
    'function select_' + tablename + '() {                                             \n' +
    '        fetch("/' + tablename + '/select_' + tablename + '", {              \n' +
    '        method: "POST",                                                     \n' +
    '        headers: {                                                          \n' +
    '            "Content-Type": "application/x-www-form-urlencoded"             \n' +
    '        },                                                                  \n' +
    '  body: "token=" + document.getElementById("token").value                   \n' +
    elementsByIds +
    '   })                                                                       \n' +
    '        .then(res => res.json())                                            \n' +
    '        .then(datos => {                                                    \n' +
    '            tabla(datos)                                                    \n' +
    '        }                                                                   \n' +
    '        );                                                                  \n' +
    '}                                                                           \n' +
    'function tabla(datos) {                                                     \n' +
    '    contenido.innerHTML = "";                                               \n' +
    '    for (let valor of datos) {                                              \n' +
    '        contenido.innerHTML += `                                            \n' +
    '        <tr>                                                                \n' +
    tablaDinamica +
    '        </tr>                                                               \n' +
    '        `                                                                   \n' +
    '    }                                                                       \n' +
    '    $("#Table tr").on("click", function () {                                \n' +
    tablaDinamicaRefresh +
    '    });                                                                     \n' +
    '}                                                                           \n' +
    'function cancelar() {                                                       \n' +
    elementsByIdsCancelar +
    '    location.reload();                                                      \n' +
    '}                                                                           \n' +
    '$("#Table tr").on("click", function () {                                    \n' +
    tablaDinamicaRefresh +
    '});                                                                        \n'
    , error => { if (error) console.log(error); });
};