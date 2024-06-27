import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";

const app = express();
const port = 3080;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ 
    extended: true
}));
/////////////CONEXION////////////////
async function verificarConexion() {
  try {
      await sequelize.authenticate();
      console.log("Conexion satisfactoria con la BD");
      await sequelize.sync({force: true});
  }
  catch(error) {
      console.error("No se puede conectar a la BD", error);
  }
}
app.listen(port, function() {
  console.log("Servidor escuchando en puerto " + port);
  verificarConexion();
});
/////////////USUARIOS////////////////
app.get("/admin/usuarios/:id", async function(req, res){
    const idUser = req.params.id;
    try{
        const usuario = await Usuario.findOne({
            where: {id: idUser}, include: [
                {model: Orden, as: "ordenes", attributes: ["id", "fechaOrden", "cuentaTotal", "estado"]}]});
        res.status(201).json(usuario);
    }catch(error){  
        res.status(400).json("Error en la BD");
    }   
});
app.get("/admin/usuarios", async function(req, res){
      const usuarios = await Usuario.findAll({include: [{model: Orden, as: "ordenes", attributes: ["id", "fechaOrden", "cuentaTotal", "estado"]}]});
      res.status(201).json(usuarios);
});
app.post("/admin/usuario", async function(req, res){
        const data = req.body;
        if(data.nombre && data.apellido && data.correo && data.contrasena && data.fechaRegistro && data.estado){
            const usuarioCreado = await Usuario.create({
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                contrasena: data.contrasena,
                fechaRegistro: data.fechaRegistro,
                estado: data.estado
            });
            res.status(201).json(usuarioCreado);
        }else{
            res.status(400).json("Faltan datos");
        }
});
app.put("/admin/usuarios/:id", async function(req, res){
      const idUser = req.params.id;
      const data = req.body;
      try{
        const usuario = await Usuario.findOne({where: {id: idUser}});
        await usuario.update({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            contrasena: data.contrasena,
            fechaRegistro: data.fechaRegistro,
            estado: data.estado
        });
        res.status(201).json(usuario);
      }catch(error){
        res.status(400).json("Error en la BD");
      }
});
app.delete("/admin/usuarios/:id", async function(req, res){
      const idUser = req.params.id;
      try{
            await Usuario.destroy({where: {id: idUser}});
            res.send("Usuario eliminado");
      }catch(error){    
            res.status(400).send("Error en la BD");
      }      
});
/////////////ORDENES////////////////
app.get("/admin/ordenes/:id", async function(req, res){
   const idOrden = req.params.id;
   try{
       const orden = await Orden.findOne({where: {id: idOrden}});
       res.status(201).json(orden);
    }catch(error){
        res.status(400).json("Error en la BD");
    }
});
app.get("/admin/ordenes", async function(req, res){
        const ordenes = await Orden.findAll();
        res.status(201).json(ordenes);
});
app.get("/admin/usuarios/:id/ordenes", async function(req, res){
      const idUser = req.params.id;
      const usuario = await Usuario.findOne({where: {id: idUser}});
      const ordenes = await usuario.getOrdenes();
      res.json(ordenes);
});
app.post("/admin/usuarios/:id/orden", async function(req, res){
        const data = req.body;
        const idUser = req.params.id;
        if(data.nombre && data.apellido && data.fechaOrden && data.cuentaTotal && data.correo && data.estado){
            const ordenCreada = await Orden.create({
                fechaOrden: data.fechaOrden,
                cuentaTotal: data.cuentaTotal,
                estado: data.estado
            });
            const usuario = await Usuario.findOne({where: {id: idUser}});    
            await usuario.addOrden(ordenCreada);
            const result = await Orden.findOne({where: {id: ordenCreada.id}});
            res.status(201).json(result);
        }else{
            res.status(400).json("Faltan datos");
        }
});
app.put("/admin/ordenes/:id", async function(req, res){
        const idOrden = req.params.id;
        const data = req.body;
        try{
            const orden = await Orden.findOne({where: {id: idOrden}});
            await orden.update({
                fechaOrden: data.fechaOrden,
                cuentaTotal: data.cuentaTotal,
                estado: data.estado
            });
            res.status(201).json(orden);
        }catch(error){
            res.status(400).json("Error en la BD");
        }
});
app.delete("/admin/ordenes/:id", async function(req, res){
      const idOrden = req.params.id;
      try{
            await Orden.destroy({where: {id: idOrden}});
            res.send("Orden eliminada");
      }catch(error){
            res.status(400).send("Error en la BD");
      }
});



