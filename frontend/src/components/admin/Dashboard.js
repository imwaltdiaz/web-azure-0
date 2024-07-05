import React, { useState, useEffect } from "react";
import { CabeceraAdmin } from "../common/CabeceraAdmin";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

export default function Dashboard() {
  const [numUsuarios, setNumUsuarios] = useState(0);
  const [numOrdenes, setNumOrdenes] = useState(0);
  const [ingresoTotal, setIngresoTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3080/admin/usuarios'); // Reemplaza con la URL correcta de tu API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const usuarios = await response.json();
        const usuariosHoy = usuarios.filter(usuario => dayjs(usuario.fechaRegistro).isSame(selectedDate, 'day'));
        setNumUsuarios(usuariosHoy.length); // Actualiza el estado con el número de usuarios de hoy
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    const fetchOrdenes = async () => {
      try {
        const response = await fetch('http://localhost:3080/admin/ordenes'); // Reemplaza con la URL correcta de tu API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const ordenes = await response.json();
        const ordenesHoy = ordenes.filter(orden => dayjs(orden.fechaOrden).isSame(selectedDate, 'day'));
        setNumOrdenes(ordenesHoy.length); // Actualiza el estado con el número de órdenes de hoy

        const totalIngresos = ordenesHoy.reduce((total, orden) => total + orden.cuentaTotal, 0);
        setIngresoTotal(totalIngresos); // Actualiza el estado con el ingreso total de hoy
      } catch (error) {
        console.error('Error fetching ordenes:', error);
      }
    };

    fetchUsuarios();
    fetchOrdenes();
  }, [selectedDate]);

  const card0 = (
    <React.Fragment>
      <CardContent
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          height: "100px",
          width: "200px",
          backgroundColor: "#E4E4E5"
        }}
      >
        <Typography variant="h2" component="div">
          {numOrdenes}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Órdenes el día de hoy
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  const card1 = (
    <React.Fragment>
      <CardContent
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          height: "100px",
          width: "200px",
          backgroundColor: "#E4E4E5"
        }}
      >
        <Typography variant="h2" component="div">
          {numUsuarios}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Usuarios nuevos
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  const card2 = (
    <React.Fragment>
      <CardContent
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          height: "100px",
          width: "200px",
          backgroundColor: "#E4E4E5"
        }}
      >
        <Typography variant="h3" component="div">
          S/{ingresoTotal}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Ingresos de hoy
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  return (
    <>
      <Container>
        <Stack direction="column">
          <CabeceraAdmin onDateChange={handleDateChange} />
          <Stack direction="row" justifyContent="space-between" pt="20px">
            <Card variant="outlined">{card0}</Card>
            <Card variant="outlined">{card1}</Card>
            <Card variant="outlined">{card2}</Card>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
