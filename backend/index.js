import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";
import { Producto } from "./models/Producto.js";
import { Orden_Producto } from "./models/Orden_Producto.js";
import { or } from "sequelize";

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
app.get("/admin/usuarios/:id", async function(req, res) {
    const idUser = req.params.id;
    try {
      const usuario = await Usuario.findOne({
        where: { id: idUser },
        include: [
          {
            model: Orden,
            attributes: ["id", "fechaOrden", "cuentaTotal", "estado", "direccion", "metPago", "nroTarjeta" ,"envio"],
            include: [
              {
                model: Orden_Producto,
                include: [
                  {
                    model: Producto,
                    attributes: ["id", "detalle", "precio", "fechaRegistro", "stock", "estado"]
                  }
                ]
              }
            ], order: [['id', 'ASC']]
          }
        ], order: [['id', 'ASC']]
      });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json({ error: "Error en la BD" });
    }
  });
app.get("/admin/usuarios", async function(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        include: [
            {
              model: Orden,
              attributes: ["id", "fechaOrden", "cuentaTotal", "estado", "direccion", "metPago", "nroTarjeta", "envio"],
              include: [
                {
                  model: Orden_Producto,
                  include: [
                    {
                      model: Producto,
                      attributes: ["id", "detalle", "precio", "fechaRegistro", "stock", "estado"]
                    }
                  ],order: [['id', 'ASC']]
                }
              ],order: [['id', 'ASC']]
            }
          ],order: [['id', 'ASC']]
      });
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });
app.post("/admin/usuario", async function(req, res){
    try {    
        const data = req.body;
        const estadodefault = "Activo"
        if(data.nombre && data.apellido && data.correo && data.contrasena && data.fechaRegistro){
            const usuarioCreado = await Usuario.create({
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                contrasena: data.contrasena,
                fechaRegistro: data.fechaRegistro,
                estado: estadodefault
            });
            res.status(201).json(usuarioCreado);
            console.log("Usuario creado")
        }else{
            res.status(400).json("Faltan datos");
        }
    }catch(error){
        res.status(400).json("Error en la BD");
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
app.get("/admin/ordenes", async function(req, res) {
    try {
      const ordenes = await Orden.findAll({
        include: [
          {
            model: Usuario,
            attributes: ["id", "nombre", "apellido", "correo"]
          },
          {
            model: Orden_Producto,
            include: [
              {
                model: Producto,
                attributes: ["id", "detalle", "precio", "fechaRegistro", "stock", "estado"]
              }
            ],order: [['id', 'ASC']]
          }
        ],order: [['id', 'ASC']]
      });
      res.status(200).json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
app.get("/admin/usuarios/:id/ordenes", async function(req, res){
    const idUser = req.params.id;
    try {
      const usuario = await Usuario.findOne({ where: { id: idUser } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const ordenes = await usuario.getOrdens({order: [['id', 'ASC']]});
      res.json(ordenes);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
app.post("/admin/usuarios/:id/orden", async function(req, res) {
    try {
        const data = req.body;
        const idUser = req.params.id;
        const cuenta = 0;
        const estadodefault = "En Proceso";

        const usuario = await Usuario.findByPk(idUser);
        if (!usuario) {
            console.log('Usuario no encontrado');
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (data.fechaOrden && data.estado && data.direccion && data.metPago && data.nroTarjeta && data.envio) {
            const ordenCreada = await Orden.create({
                fechaOrden: data.fechaOrden,
                cuentaTotal: cuenta,
                estado: estadodefault,
                direccion: data.direccion,
                metPago: data.metPago,
                nroTarjeta: data.nroTarjeta,
                envio: data.envio,
                usuarioId: idUser
            });
            await usuario.addOrden(ordenCreada);
            const result = await Orden.findOne({ 
                where: { id: ordenCreada.id },
                include: [{ model: Usuario, attributes: ["nombre", "apellido", "correo"]}]
            });
            res.status(201).json(result);
            console.log('Orden creada y asociada al usuario');
        } else {
            console.log('Faltan datos en req.body:', data);
            res.status(400).json("Faltan datos");
        }
    } catch (error) {
        console.error('Error al crear la orden y asociarla al usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
                estado: data.estado,
                direccion: data.direccion,
                metPago: data.metPago,
                nroTarjeta: data.nroTarjeta,
                envio: data.envio
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
/////////////PRODUCTOS////////////////
app.get("/admin/productos/:id", async function(req, res){
    const idProducto = req.params.id;
    try{
        const producto = await Producto.findOne({where: {id: idProducto}});
        res.status(201).json(producto);
    }catch(error){
        res.status(400).json("Error en la BD");
    }
});
app.get("/admin/productos", async function(req, res){
    const productos = await Producto.findAll({order: [['id', 'ASC']]});
    res.status(201).json(productos);
});
app.get("/admin/usuario/:idUser/orden/:idOrden/productos", async function(req, res) {
    const idUser = req.params.idUser;
    const idOrden = req.params.idOrden;
  
    try {
      const usuario = await Usuario.findOne({ where: { id: idUser } });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const orden = await Orden.findOne({
        where: { id: idOrden, usuarioId: idUser },
        include: [
          {
            model: Producto,
            through: { attributes: [] }, // Esto asume que hay una tabla intermedia
            attributes: ["id", "detalle", "precio", "fechaRegistro", "stock", "estado"],
            order: [['id', 'ASC']]
          }
        ], order: [['id', 'ASC']]
      });
  
      if (!orden) {
        return res.status(404).json({ error: "Orden no encontrada" });
      }
  
      res.json(orden.Productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
app.post("/admin/usuario/:idUser/orden/:idOrden/producto", async function(req, res) {
    try {
      const data = req.body;
      const idUser = req.params.idUser;
      const idOrden = req.params.idOrden;
      
      const usuario = await Usuario.findByPk(idUser);
      if (!usuario) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const orden = await Orden.findOne({ where: { id: idOrden, usuarioId: idUser } });
      if (!orden) {
        console.log('Orden no encontrada');
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
  
      if (data.detalle && data.precio && data.fechaRegistro && data.stock && data.estado ) {
        const productoCreado = await Producto.create({
          detalle: data.detalle,
          precio: data.precio,
          fechaRegistro: data.fechaRegistro,
          stock: data.stock,
          estado: data.estado,
          ordenId: idOrden
        });
  
        await orden.addProducto(productoCreado, { through: {} });
        console.log('Producto creado y asociado a la orden');
        res.status(201).json(productoCreado);
      } else {
        console.log('Faltan datos en req.body:', data);
        res.status(400).json({ error: 'Faltan datos', data });
      }
    } catch (error) {
      console.error('Error al crear el producto y asociarlo a la orden:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


