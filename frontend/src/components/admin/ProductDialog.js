// ProductDialog.js
import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function ProductDialog({ open, onClose, onAddProduct, availableProducts, serie }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(availableProducts);

  const handleSearch = () => {
    setFilteredProducts(availableProducts.filter(product =>
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    ));
  };

  const isProductInAnotherSeries = (product) => {
    return product.serieId && product.serieId !== serie?.id;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.descripcion}</TableCell>
                    <TableCell>{isProductInAnotherSeries(product) ? 'En otra serie' : 'Disponible'}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => onAddProduct(product)} disabled={isProductInAnotherSeries(product)}>
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
