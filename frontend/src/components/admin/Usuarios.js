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

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [usuariosData, setUsuariosData] = useState([]);
  const navigate = useNavigate();
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';
  const [contador, setContador] = useState(1);

  useEffect(() => {
    const Usuarios = async () => {
      try {
        const response = await fetch(url2+'/admin/usuarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const data = await response.json();
        setUsuariosData(data);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
      }
    };
    Usuarios();
  }, []);

  const filteredData = usuariosData.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickVer = (user) => { 
    navigate(`/admin/usuario/${user.id}`, { state: { user } });
  };
  const handleClickActivar = async (user) => {
    setContador(contador + 1);
    try {
      const nuevoEstado = contador % 2 !== 0 ? "Inactivo" : "Activo";
      const response = await fetch(url2 + '/admin/usuarios/' + user.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: nuevoEstado
        })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del usuario');
      }
      const updatedUser = await response.json();
      setUsuariosData(prevUsuariosData => prevUsuariosData.map(usuario =>
        usuario.id === updatedUser.id ? updatedUser : usuario
      ));
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
    }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "40px"}}>
      <Stack direction="column" justifyContent="flex-start" paddingLeft="1vw" paddingRight="2vw" sx={{ flexGrow: 1 }}>
        <Box sx={{
            paddingBottom: "8px",
            paddingTop: "8px",
            backgroundColor: 'skyblue',
            width: '77vw'
          }}><Typography paddingLeft="1vw" variant="h6" component="div">
          Usuarios Registrados
          </Typography>
        </Box>
        <Box sx={{paddingTop: "8px", paddingBottom: "8px"}}></Box>
        <TextField
          id='Users' 
          placeholder='  Buscar por correo, nombre o apellido' 
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            paddingBottom: "30px",
            height: '45px',
            width: '77vw',
          }}
        />
        <TableContainer component={Paper} sx={{ flexGrow: 1}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Fecha de registro</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellido}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>{user.fechaRegistro}</TableCell>
                  <TableCell>{user.estado}</TableCell>
                  <TableCell>
                      <Button onClick={() => handleClickVer(user)}>Ver</Button>{' | '}
                      <Button onClick={() => handleClickActivar(user)}>{user.estado === "Activo" ? "Desactivar" : "Activar"}</Button>
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