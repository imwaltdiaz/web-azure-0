import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useNavigate, useLocation } from "react-router-dom";

function generateShortId() {
  return Math.floor(Math.random() * 90000) + 10000; // Generar un número entre 10000 y 99999
}

export default function AgregarProducto() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [product, setProduct] = useState({
    id: generateShortId(), // Generar un ID único para cada producto
    nombre: '',
    detalle: '',
    descripcion: '',
    caracteristicas: '',
    marca: '',
    serie: '',
    precio: '', // Asegúrate de que sea un número antes de enviarlo
    fechaRegistro: new Date().toISOString().split('T')[0], // Formato ISO
    stock: '', // Asegúrate de que sea un número antes de enviarlo
    estado: 'Disponible',
    imagen: '', // Campo para la imagen
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const method = location.state && location.state.product ? 'PUT' : 'POST';
      const url = location.state && location.state.product
        ? `http://localhost:3080/admin/productos/${product.id}`
        : 'http://localhost:3080/admin/productos';

      const data = {
        ...product,
        precio: parseInt(product.precio, 10),
        stock: parseInt(product.stock, 10),
      };

      if (isNaN(data.precio) || isNaN(data.stock)) {
        alert("Por favor, asegúrate de que los campos precio y stock sean números válidos.");
        return;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Redirigir a la tabla de productos después de guardar
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <>
      <Box sx={{ p: 3, width: "85vw", pr: 5 }}>
        <Typography
          variant="span"
          component="p"
          gutterBottom
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            fontWeight: "bold",
            mb: "20px",
          }}
        >
          {location.state && location.state.product ? 'Editar Producto' : 'Agregar Producto'}
        </Typography>
        <form>
          <Stack direction="row" justifyContent="space-between">
            <Stack
              direction="column "
              justifyContent="space-evenly"
              gap="30px"
              alignItems="center"
            >
              <Box
                sx={{
                  width: "380px",
                  height: 200,
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              ></Box>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  width: "250px",
                }}
              >
                Agregar Imagen
                <input type="file" hidden />
              </Button>
            </Stack>
            <Stack direction="column " alignItems="left" width="100%" ml="40px">
              <label>Nombre</label>
              <TextField
                name="nombre"
                label="Nombre"
                fullWidth
                margin="normal"
                size="small"
                sx={{ marginTop: "10px" }}
                onChange={handleChange}
                value={product.nombre}
              />
              <label>Descripción</label>
              <TextField
                name="descripcion"
                label="Descripción"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                size="big"
                sx={{ marginTop: "10px" }}
                onChange={handleChange}
                value={product.descripcion}
              />
              <label>Características</label>
              <TextField
                name="caracteristicas"
                label="Características"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                size="big"
                sx={{ marginTop: "10px" }}
                onChange={handleChange}
                value={product.caracteristicas}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Stack direction="column">
                  <label>Marca</label>
                  <TextField
                    name="marca"
                    label="Marca"
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    onChange={handleChange}
                    value={product.marca}
                  />
                </Stack>

                <Stack direction="column">
                  <label>Serie</label>
                  <TextField
                    name="serie"
                    label="Serie"
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    onChange={handleChange}
                    value={product.serie}
                  />
                </Stack>
                <Stack direction="column">
                  <label>Precio</label>
                  <TextField
                    name="precio"
                    label="S/"
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    onChange={handleChange}
                    value={product.precio}
                  />
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                gap="20px"
              >
                <Stack direction="column">
                  <label>Stock</label>
                  <TextField
                    name="stock"
                    label="Stock"
                    fullWidth
                    multiline
                    rows={1}
                    margin="normal"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    onChange={handleChange}
                    value={product.stock}
                  />
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                width="100%"
                gap="20px"
                sx={{
                  borderTop: "1px",
                  marginTop: "20px",
                  paddingTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ width: "250px" }}
                >
                  Guardar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Box>
    </>
  );
}
