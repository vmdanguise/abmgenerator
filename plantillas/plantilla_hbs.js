const fs = require('fs');

module.exports = function crearPlantilla(esquema_db,tablename, encabezadoTabla, cuerpoTabla, inputForm, column_reference){

  fs.writeFile(`./generated${esquema_db}/views/` + tablename + '.hbs',
    '        <p>Gestion Registro</p>' +
     '            <div id="datosTabla" style="width: 100%; height: 100px; overflow-y: scroll;">' +
    '    <table id="Table" border=1 bordercolor="white" width="100%">' +
    '        <thead>' +
    '            <tr>' +
    encabezadoTabla +
    '            </tr>' +
    '        </thead>' +
    '        <tbody id="contenido">' +
    '            {{#each ' +
    tablename +
    '}}' +
    '            <tr>' +
    cuerpoTabla +
    '            </tr>' +
    '            {{/each}}' +
    '        </tbody>' +
    '    </table>' +
       '</div>' +
    '<form>' +
    ` <button  type="submit" value="Imprimir" formaction="/${tablename}/imprimir_${tablename}" formmethod="POST"><img src="https://img.icons8.com/color/50/000000/print.png"/></button>` +
    '    <fieldset width="100">' +
    '        <input type="hidden" id="token" size="500" maxlength="500" name="token" value="{{token}}" />' +
    '        <legend>ABM</legend>' +
    '        <input class="btn" type="button" value="Buscar" onclick="select_' + tablename + '()" />' +
    '        <input class="btn" type="button" value="Alta" onclick="insertar_' + tablename + '()" />' +
    '        <input class="btn" type="button" value="Baja" onclick="delete_' + tablename + '()" />' +
    '        <input class="btn" type="button" value="Modificar" onclick="update_' + tablename + '()" />' +
    '        <input class="btn" type="button" value="Cancelar" onclick="cancelar()" />' +
    `        <input class="btn" type="button" value="Volver" onclick="try{javascript:window.opener.document.getElementById('${column_reference}').value = window.document.getElementById('${column_reference}').value;}catch(error){};window.close()"/>` +
    '        <br><br>' +
    inputForm +
    '        <br><br>' +
    '        <button  type="button" value="Buscar" onclick="select_' + tablename + '()" ><img  src="https://img.icons8.com/color/48/000000/find-user-male--v1.png" alt="Buscar"/> </button>' +
    '        <button  type="button"  value="Alta" onclick="insertar_' + tablename + '()"  ><img src="https://img.icons8.com/color/50/000000/plus--v1.png" alt="Alta"/></button>' +
    '        <button  type="button"  value="Baja" onclick="delete_' + tablename + '()"  ><img src="https://img.icons8.com/nolan/50/delete.png" alt="Baja" /></button>' +
    '        <button  type="button"  value="Modificar" onclick="update_' + tablename + '()"  ><img src="https://img.icons8.com/nolan/50/edit--v1.png" alt="Modificar" /></button>' +
    '        <button  type="button" value="Cancelar" onclick="cancelar()"  ><img  src="https://img.icons8.com/officexs/50/000000/cancel-2.png" alt="Cancelar" /></button>' +
    `        <button  type="button"  value="Volver" onclick="try{javascript:window.opener.document.getElementById('${column_reference}').value = window.document.getElementById('${column_reference}').value;}catch(error){};window.close()" ><img src="https://img.icons8.com/ios/50/000000/home.png" alt="Volver" /></button>` +
    '    </fieldset>' +
    '</form>' +
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script> \n'+
    '<script src="../../public/js/' + tablename + '_v.js"></script> \n'
    , error => { if (error) console.log(error); });



    fs.writeFile(`./generated${esquema_db}/controllers/${tablename}_c.js`,
    `
  
    let express = require('express');
    let router = express.Router();
    
    class ${tablename} {
      constructor() {}
    
      get${tablename}Stats() {
        return true;
      }
    
     async getReqEquals(req) {

        // aca hacemos operaciones de calculo
       // req.body.rol = req.body.rol.toUpperCase();
       // console.log("controller:" + req.body.rol);
          return req;
      }
    
    
    }
    
    module.exports = ${tablename};
    
  `
    , error => { if (error) console.log(error); });
  

};