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

  useEffect(() => {
    // Reemplaza esta URL con la URL de tu backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3080/admin/productos');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Datos obtenidos del backend:', result); // Verifica los datos obtenidos
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

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

  const filteredData = data.filter((product) =>
    product.id.toString().includes(searchTerm) ||
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
        label="Buscar por ID, serie o detalle"
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
                <TableCell>{product.detalle}</TableCell>
                <TableCell>{product.serie}</TableCell>
                <TableCell>{product.precio}</TableCell>
                <TableCell>{product.fechaRegistro}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.estado}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleViewProduct(product)}>Ver</Button>
                  <Button color="secondary">Desactivar</Button>
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
