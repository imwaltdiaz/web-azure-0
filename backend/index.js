import express from "express"
import {es, es_MX, Faker} from '@faker-js/faker';
import cors from "cors"
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";

const app = express();
const port = 3080;

app.use(cors());
app.use(express.json());

//app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get("/admin/usuarios/:id", function(req, res){
      Usuario.findByPk(req.params.id).then((resultado) => {
      res.json(resultado);
  });
});
app.get("/admin/usuarios", function(req, res){
      Usuario.findAll().then((resultado) => {
      res.json(resultado);
  });
});
app.post("/admin/usuarios", function(req, res){
        const data = req.body;
        Usuario.create({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            contrasena: data.contrasena,
            fechaRegistro: data.fechaRegistro,
            estado: data.estado
        }).then((resultado) => {
            res.json(resultado);
        });
});
app.get("/admin/ordenes/:id", function(req, res){
      Orden.findByPk(req.params.id).then((resultado) => {
      res.json(resultado);
  });
});
app.get("/admin/ordenes", function(req, res){
      Orden.findAll().then((resultado) => {
      res.json(resultado);
  });
});
app.put("/admin/usuarios/:id", function(req, res){
      const UserId = req.params.id;
      const data = req.body;
      Usuario.update({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          contrasena: data.contrasena,
          fechaRegistro: data.fechaRegistro,
          estado: data.estado
      }, {
      where: {
          id: UserId
      }
      }).then(() => {
          res.json("Usuario actualizado");
      });
});
app.put("/admin/ordenes/:id", function(req, res){
      const OrdenId = req.params.id;
      const data = req.body;
      Orden.update({
          nombre: data.nombre,
          apellido: data.apellido,
          fechaOrden: data.fechaOrden,
          cuentaTotal: data.cuentaTotal,
          correo: data.correo,
          estado: data.estado
      }, {
      where: {
          id: OrdenId
      }
      }).then(() => {
          res.json("Orden actualizada");
      });
});
app.delete("/admin/usuarios/:id", function(req, res){
      const UserId = req.params.id;
      Usuario.destroy({
      where: {
          id: UserId
      }
      }).then(() => {
          res.json("Usuario eliminado");
      });
});
app.delete("/admin/ordenes/:id", function(req, res){
      const OrdenId = req.params.id;
      Orden.destroy({
      where: {
          id: OrdenId
      }
      }).then(() => {
          res.json("Orden eliminada");
      });
});
async function verificarConexion() {
  try {
      await sequelize.authenticate();
      console.log("Conexion satisfactoria con la BD");
      await sequelize.sync({force: true});
      //await sequelize.sync();
  }
  catch(error) {
      console.error("No se puede conectar a la BD", error);
  }
}

app.listen(port, function() {
  console.log("Servidor escuchando en puerto " + port);
  verificarConexion();
});


