import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Orden } from "./models/Orden.js";
import { Producto } from "./models/Producto.js";
import { Orden_Producto } from "./models/Orden_Producto.js";
import { Serie } from "./models/Serie.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3080;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

/////////////CONEXION////////////////
async function verificarConexion() {
  try {
    await sequelize.authenticate();
    console.log("Conexion satisfactoria con la BD");
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("No se puede conectar a la BD", error);
  }
}

app.listen(port, function () {
  console.log("Servidor escuchando en puerto " + port);
  verificarConexion();
});

/////////////USUARIOS////////////////
app.get("/", function (req, res) {
  return res.send("API de la tienda del abuelo");
});

app.get("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  try {
    const usuario = await Usuario.findOne({
      where: { id: idUser },
      include: [
        {
          model: Orden,
          attributes: [
            "id",
            "fechaOrden",
            "cuentaTotal",
            "estado",
            "direccion",
            "metPago",
            "nroTarjeta",
            "envio",
          ],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: [
                    "id",
                    "detalle",
                    "precio",
                    "fechaRegistro",
                    "stock",
                    "estado",
                  ],
                },
              ],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Error en la BD" });
  }
});

app.get("/admin/usuarios", async function (req, res) {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Orden,
          attributes: [
            "id",
            "fechaOrden",
            "cuentaTotal",
            "estado",
            "direccion",
            "metPago",
            "nroTarjeta",
            "envio",
          ],
          include: [
            {
              model: Orden_Producto,
              include: [
                {
                  model: Producto,
                  attributes: [
                    "id",
                    "detalle",
                    "precio",
                    "fechaRegistro",
                    "stock",
                    "estado",
                  ],
                },
              ],
              order: [["id", "ASC"]],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.post("/admin/usuario", async function (req, res) {
  try {
    const data = req.body;
    const estadodefault = "Activo";
    if (data.nombre && data.apellido && data.correo && data.contrasena) {
      const usuarioCreado = await Usuario.create({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        contrasena: data.contrasena,
        estado: estadodefault,
      });
      res.status(201).json(usuarioCreado);
      console.log("Usuario creado");
    } else {
      res.status(400).json("Faltan datos");
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ error: "Error en la BD", details: error.message });
  }
});

app.put("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  const data = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { id: idUser } });
    await usuario.update({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      contrasena: data.contrasena,
      fechaRegistro: data.fechaRegistro,
      estado: data.estado,
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.delete("/admin/usuarios/:id", async function (req, res) {
  const idUser = req.params.id;
  try {
    await Usuario.destroy({ where: { id: idUser } });
    res.send("Usuario eliminado");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

app.post("/login", async (req, res) => {
  const { correo } = req.body;

  try {
    if (!correo) {
      return res.status(400).json({ message: "Correo no proporcionado" });
    }

    console.log("Correo recibido:", correo);

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.get("/usuarios/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.put("/usuarios/:userId", async (req, res) => {
  const { userId } = req.params;
  const { nombre, apellido, correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo = correo;
    usuario.contrasena = contrasena;
    await usuario.save();

    res.json(usuario);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.get("/usuarios/:userId/ordenes", async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await Usuario.findByPk(userId, {
      include: [{ model: Orden, include: [Producto] }],
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario.Ordens);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

/////////////ORDENES////////////////
app.get("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  try {
    const orden = await Orden.findOne({ where: { id: idOrden } });
    res.status(201).json(orden);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.get("/admin/ordenes", async function (req, res) {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "correo"],
        },
        {
          model: Orden_Producto,
          include: [
            {
              model: Producto,
              attributes: [
                "id",
                "detalle",
                "precio",
                "fechaRegistro",
                "stock",
                "estado",
              ],
            },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/admin/usuarios/:id/ordenes", async function (req, res) {
  const idUser = req.params.id;
  try {
    const usuario = await Usuario.findOne({ where: { id: idUser } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const ordenes = await usuario.getOrdens({ order: [["id", "ASC"]] });
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/admin/usuarios/:id/orden", async function (req, res) {
  try {
    const data = req.body;
    const idUser = req.params.id;
    const cuenta = 0;
    const estadodefault = "En Proceso";

    const usuario = await Usuario.findByPk(idUser);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (data.direccion && data.metPago && data.nroTarjeta && data.envio) {
      const ordenCreada = await Orden.create({
        cuentaTotal: cuenta,
        estado: estadodefault,
        direccion: data.direccion,
        metPago: data.metPago,
        nroTarjeta: data.nroTarjeta,
        envio: data.envio,
        usuarioId: idUser,
      });
      await usuario.addOrden(ordenCreada);
      const result = await Orden.findOne({
        where: { id: ordenCreada.id },
        include: [
          { model: Usuario, attributes: ["nombre", "apellido", "correo"] },
        ],
      });
      return res.status(201).json(result);
    } else {
      console.log("Faltan datos en req.body:", data);
      return res.status(400).json("Faltan datos");
    }
  } catch (error) {
    console.error("Error al crear la orden y asociarla al usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  const { productos, ...data } = req.body;
  try {
    const orden = await Orden.findOne({ where: { id: idOrden } });
    await orden.update(data);

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        if (producto) {
          await Orden_Producto.create({
            ordenId: orden.id,
            productoId: producto.id,
          });
        }
      }
    }

    const ordenActualizada = await Orden.findOne({
      where: { id: idOrden },
      include: [
        {
          model: Producto,
          attributes: [
            "id",
            "detalle",
            "precio",
            "fechaRegistro",
            "stock",
            "estado",
          ],
        },
      ],
    });

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
});

app.delete("/admin/ordenes/:id", async function (req, res) {
  const idOrden = req.params.id;
  try {
    await Orden.destroy({ where: { id: idOrden } });
    res.send("Orden eliminada");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

/////////////PRODUCTOS////////////////
app.get("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  try {
    const producto = await Producto.findOne({ where: { id: idProducto } });
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json("Error en la BD");
  }
});

app.get("/admin/productos", async function (req, res) {
  const productos = await Producto.findAll({ order: [["id", "ASC"]] });
  res.status(201).json(productos);
});

app.get("/admin/usuario/:idUser/orden/:idOrden/productos", async function (req, res) {
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
          attributes: [
            "id",
            "detalle",
            "precio",
            "fechaRegistro",
            "stock",
            "estado",
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["id", "ASC"]],
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

app.post("/admin/productos", async function (req, res) {
  try {
    const { nombre, detalle, precio, fechaRegistro, stock, estado, imagen } = req.body;
    const nuevoProducto = await Producto.create({
      nombre,
      detalle,
      precio,
      fechaRegistro: fechaRegistro || new Date(), // Asigna la fecha actual si no se proporciona
      stock,
      estado,
      imagen,
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

app.put("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  try {
    const { nombre, detalle, precio, fechaRegistro, stock, estado, imagen } = req.body;

    // Validar que precio y stock sean números
    const precioParsed = parseInt(precio, 10);
    const stockParsed = parseInt(stock, 10);

    if (isNaN(precioParsed) || isNaN(stockParsed)) {
      return res.status(400).send("Precio y Stock deben ser números válidos");
    }

    const producto = await Producto.findOne({ where: { id: idProducto } });
    if (producto) {
      await producto.update({
        nombre,
        detalle,
        precio: precioParsed,
        fechaRegistro,
        stock: stockParsed,
        estado,
        imagen,
      });
      res.status(200).json(producto);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

app.delete("/admin/productos/:id", async function (req, res) {
  const idProducto = req.params.id;
  try {
    await Producto.destroy({ where: { id: idProducto } });
    res.send("Producto eliminado");
  } catch (error) {
    res.status(400).send("Error en la BD");
  }
});

/////////////SERIES////////////////
app.get("/admin/series", async function (req, res) {
  try {
    const series = await Serie.findAll({
      include: [
        {
          model: Producto,
          attributes: [
            "id",
            "nombre",
            "detalle",
            "precio",
            "fechaRegistro",
            "stock",
            "estado",
          ],
        },
      ],
    });
    res.status(200).json(series);
  } catch (error) {
    console.error("Error al obtener las series:", error);
    res.status(500).json({ error: "Error al obtener las series" });
  }
});

app.get("/admin/series/:id", async function (req, res) {
  const idSerie = req.params.id;
  try {
    const serie = await Serie.findOne({
      where: { id: idSerie },
      include: [
        {
          model: Producto,
          attributes: [
            "id",
            "nombre",
            "detalle",
            "precio",
            "fechaRegistro",
            "stock",
            "estado",
          ],
        },
      ],
    });
    res.status(200).json(serie);
  } catch (error) {
    console.error("Error al obtener la serie:", error);
    res.status(500).json({ error: "Error al obtener la serie" });
  }
});

app.post("/admin/series", async function (req, res) {
  try {
    const { nombre, descripcion, productos } = req.body;
    const nuevaSerie = await Serie.create({ nombre, descripcion });
    if (productos && productos.length > 0) {
      await nuevaSerie.addProductos(productos);
    }
    res.status(201).json(nuevaSerie);
  } catch (error) {
    console.error("Error al crear la serie:", error);
    res.status(500).json({ error: "Error al crear la serie" });
  }
});

app.put("/admin/series/:id", async function (req, res) {
  const idSerie = req.params.id;
  try {
    const { nombre, descripcion, productos } = req.body;
    const serie = await Serie.findOne({ where: { id: idSerie } });
    await serie.update({ nombre, descripcion });

    if (productos && productos.length > 0) {
      for (const productoId of productos) {
        const producto = await Producto.findByPk(productoId);
        await serie.addProducto(producto);
      }
    }

    const serieActualizada = await Serie.findOne({
      where: { id: idSerie },
      include: [
        {
          model: Producto,
          attributes: [
            "id",
            "nombre",
            "detalle",
            "precio",
            "fechaRegistro",
            "stock",
            "estado",
          ],
        },
      ],
    });

    res.status(200).json(serieActualizada);
  } catch (error) {
    console.error("Error al actualizar la serie:", error);
    res.status(500).json({ error: "Error al actualizar la serie" });
  }
});

app.delete("/admin/series/:id", async function (req, res) {
  const idSerie = req.params.id;
  try {
    await Serie.destroy({ where: { id: idSerie } });
    res.status(200).send("Serie eliminada");
  } catch (error) {
    console.error("Error al eliminar la serie:", error);
    res.status(500).json({ error: "Error al eliminar la serie" });
  }
});
//dev
app.delete("/admin/series/:id/productos/:productoId", async function (req, res) {
  const idSerie = req.params.id;
  const productoId = req.params.productoId;
  try {
    const serie = await Serie.findByPk(idSerie);
    if (!serie) {
      return res.status(404).json({ error: "Serie no encontrada" });
    }
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    await serie.removeProducto(producto);
    res.status(200).send("Producto removido de la serie");
  } catch (error) {
    console.error("Error al remover el producto de la serie:", error);
    res.status(500).json({ error: "Error al remover el producto de la serie" });
  }
});
