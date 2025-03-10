import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import CarritoDeCompras from "./carritoDeCompras";
import Checkout from "./checkout";
import PedidoCompleto from "./pedidoCompleto";
import Principal from "./paginaPrincipal";
import Busqueda from "./busquedaProducto";
import Details from "./detallesProducto";
import Datos_Usuario from "./datos_Usuario";
import Detalle_Usuario from "./detalle_Usuario";
import Cambiar_Contrasena from './cambiar_Contrasena';
import LoginPage from './login_page';
import NuevaCuenta from './nueva_cuenta';
import ForgotPasswordPage from './perdida_contra';
import MainPage from './pantalla_principal';

function UserMain() {
  return (
    <div>
      <Routes>
        <Route index element={<Principal />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/detalles" element={<Details />} />
        <Route path="/carritoDeCompras" element={<CarritoDeCompras />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedidoCompleto" element={<PedidoCompleto />} />
        <Route path="/datosusuario" element={<Datos_Usuario />} />
        <Route path="/detalleusuario/:userId" element={<Detalle_Usuario />} />
        <Route path="/cambiarcontrasena/:userId" element={<Cambiar_Contrasena />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/perdida-contra" element={<ForgotPasswordPage />} />
        <Route path="/crear-cuenta" element={<NuevaCuenta />} />
        <Route path="/pantalla-principal/:userId" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default UserMain;
