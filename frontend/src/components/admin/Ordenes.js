import React, { useState, useEffect } from 'react';
import { Stack, TextField, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination, Button, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
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

export default function Ordenes() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ordenesData, setOrdenesData] = useState([]);
  const navigate = useNavigate();
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';


  useEffect(() => {
    const Ordenes = async () => {
      try {
        const response = await fetch(url2+'/admin/ordenes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const data = await response.json();
        setOrdenesData(data);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
      }
    };
    Ordenes();
  }, []);

  const filteredData = ordenesData.filter((order) =>
    order.Usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickVer = (order) => {
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
          }}><Typography paddingLeft="1vw" variant="h6" component="div">
          Ordenes
          </Typography>
        </Box>
        <Box sx={{paddingTop: "8px", paddingBottom: "8px"}}></Box>
        <TextField 
          id='Orders' 
          placeholder='  Nombre o apellido del usuario o numero de orden' 
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            paddingBottom: "30px",
            height: '45px',
            width: '77vw',
          }}
        />
        <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha de orden</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.Usuario.nombre}{" "}{order.Usuario.apellido}</TableCell>
                  <TableCell>{order.fechaOrden}</TableCell>
                  <TableCell>{order.cuentaTotal}</TableCell>
                  <TableCell>{order.Usuario.correo}</TableCell>
                  <TableCell>{order.estado}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClickVer(order)}>Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={7} 
                      count={filteredData.length}
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