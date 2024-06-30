import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AgregarSerie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serie } = location.state || {};
  const [nombre, setNombre] = useState(serie?.nombre || '');
  const [descripcion, setDescripcion] = useState(serie?.descripcion || '');
  const [productos, setProductos] = useState(serie?.productos || []);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);

  const handleAddProduct = () => {
    setOpen(true);
  };

  const handleRemoveProduct = (product) => {
    setProductos(productos.filter(p => p.id !== product.id));
  };

  const handleGuardarClick = () => {
    navigate('/admin/series');
  };

  const handleSearch = async () => {
    // Aquí deberías hacer la llamada a la base de datos para buscar los productos
    // Para la demostración, usaré un conjunto de datos estático
    const fetchedProducts = [
      { id: 1, descripcion: 'Manga Dragon Ball Vol 1' },
      { id: 2, descripcion: 'Manga Dragon Ball Vol 2' }
    ];

    setAvailableProducts(fetchedProducts.filter(product =>
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    ));
  };

  const handleAddToSerie = (product) => {
    setProductos([...productos, product]);
    setOpen(false);
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" gutterBottom>Agregar Serie</Typography>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" gutterBottom>Agregar Serie</Typography>
          <Box sx={{ border: '1px solid #ccc', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="caption">Imagen Placeholder</Typography>
          </Box>
          <Button variant="contained" component="label" sx={{ marginTop: '10px' }}>
            Agregar Imagen
            <input type="file" hidden />
          </Button>
        </Box>
        <Box sx={{ flex: 2 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: '10px' }}
          />
          <Typography variant="h6" gutterBottom>Productos en la serie</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>
                      <Button color="secondary" onClick={() => handleRemoveProduct(producto)}>Remover</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <IconButton onClick={handleAddProduct} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleGuardarClick}>Guardar</Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <TextField
              fullWidth
              placeholder="Buscar por descripción o ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>Buscar</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.descripcion}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleAddToSerie(product)}>Agregar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
