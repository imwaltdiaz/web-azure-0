import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Box, Button, TextField, Typography, Table, TableFooter, TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;
    
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
    
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
    
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5}}>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    );
}
export default function DetalleUsuario(){  
    const [searchTerm, setSearchTerm] = useState(""); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [ordenesData, setOrdenesData] = useState([]);  
    const location = useLocation();
    const navigate = useNavigate(); 
    const { user } = location.state || {};
    const [id, setId] = useState(user?.id || ''); 
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [apellido, setApellido] = useState(user?.apellido || '');
    const [correo, setCorreo] = useState(user?.correo || '');
    const [fechaRegistro, setFechaRegistro] = useState(user?.fechaRegistro || '');
    const [orden, setOrden] = useState(user?.Ordens || []);	

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewClick = (order) => {
        navigate(`/admin/orden/${order.id}`, { state: { order } });
    };
    
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "40px"}}>
            <Stack direction="column" justifyContent="flex-start" paddingLeft="1vw" sx={{ flexGrow: 1 }}>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    width: '77vw'
                }}>
                    <Typography paddingLeft="1vw" variant="h6" component="div">
                        Detalle de Usuario Registrado
                    </Typography>
                </Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: '#E7E3E3',
                    width: '77vw'
                }}>
                    <Stack direction="row" justifyContent="space-around">
                        <p>ID: {id}</p>
                        <p>Nombre: {nombre}{" "}{apellido}</p>
                        <p>Correo: {correo}</p>
                        <p>Fecha de Registro: {fechaRegistro}</p>
                    </Stack>
                </Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    width: '77vw'
                }}>
                    <Typography paddingLeft="1vw" variant="h6" component="div">
                        Ordenes recientes (maximo 10)
                    </Typography>
                </Box>
                <TableContainer component={Paper} sx={{ flexGrow: 1}}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha de orden</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Productos</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orden.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.fechaOrden}</TableCell>
                            <TableCell>{order.cuentaTotal}</TableCell>
                            <TableCell>  {order.Orden_Productos ? order.Orden_Productos.length : 0}</TableCell>
                            <TableCell>{order.estado}</TableCell>
                            <TableCell>
                                <Button color="primary" onClick={() => handleViewClick(order)}>Ver</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={6}
                                count={orden.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                    </Table>
                </TableContainer>
            </Stack>
        </Box>  
    );
}