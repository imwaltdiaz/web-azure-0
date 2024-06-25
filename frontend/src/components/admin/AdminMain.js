import React from "react";
import Header from "../common/header";
import Footer from "../common/footer";
import { Stack } from "@mui/material";
import DrawerDev from "./DrawerDev";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Productos from "./Productos";
import Series from "./Series";
import AgregarSerie from "./AgregarSerie";
import AgregarProducto from "./AgregarProducto";
import Usuarios from "./Usuarios";
import data from './data.json';
import Ordenes from "./Ordenes";

export default function AdminMain() {
  return (
    <>
      <Header />
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignContent="flex-start"
        paddingLeft="1vw"
      >
        <DrawerDev />
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="productos" element={<Productos data={data} />} />
          <Route path="series" element={<Series />} />
          <Route path="agregarproducto" element={<AgregarProducto />} />
          <Route path="agregarserie/:id" element={<AgregarSerie />} />
        </Routes>
      </Stack>
      <Footer />
    </>
  );
}
