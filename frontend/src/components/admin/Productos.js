import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Productos() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3080/admin/productos');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3080/admin/productos/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Actualizar la lista de productos después de eliminar uno
      setData(data.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredData = data.filter((product) =>
    product.id.toString().includes(searchTerm) ||
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.serie && product.serie.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = () => {
    navigate('/admin/agregarproducto');
  };

  const handleViewProduct = (product) => {
    navigate('/admin/agregarproducto', { state: { product } });
  };

  return (
    <Paper style={{ minHeight: '400px', minWidth: '70vw' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" padding={2}>
        <h2>Productos</h2>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          + Agregar Producto
        </Button>
      </Stack>
      <TextField
        label="Buscar por ID, nombre, serie o detalle"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearch}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.detalle}</TableCell>
                <TableCell>{product.serie}</TableCell>
                <TableCell>{product.precio}</TableCell>
                <TableCell>{product.fechaRegistro}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.estado}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleViewProduct(product)}>Ver</Button>
                  <Button color="secondary" onClick={() => handleDeleteProduct(product.id)}>Desactivar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
