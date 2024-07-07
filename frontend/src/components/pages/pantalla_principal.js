import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import MenuLateral from './MenuLateral';
import OrdenesUsuario from './Ordenes_Usuario';

const MainPage = () => {
  const [selectedSection, setSelectedSection] = useState('inicio');
  const { userId } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL

  const renderContent = () => {
    switch (selectedSection) {
      case 'ordenes-recientes':
        return <OrdenesUsuario userId={userId} />; // Navega a OrdenesUsuario con el ID del usuario
      case 'datos-registro':
        return null; // El menú lateral se encargará de la navegación
      case 'cambiar-password':
        return null; // El menú lateral se encargará de la navegación
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Bienvenido a tu cuenta
            </Typography>
            <Typography variant="body1">
              Aquí puedes ver y gestionar tu información personal y tus órdenes recientes.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', mt: 4 }}>
          <MenuLateral userId={userId} setSelectedSection={setSelectedSection} />
          <Box sx={{ flexGrow: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default MainPage;
