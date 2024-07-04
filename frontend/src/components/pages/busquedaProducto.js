import { Box } from "@mui/material";
import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import ListaItemCarr from "../user/ItemBusqueda";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Header2 from '../user/headerU';
import Footer from '../common/footer';
import { useLocation } from "react-router-dom";
function Busqueda(){
    const location = useLocation();
    
    const searchQuery = location.state.searchQuery;

    const [selectedValue, setSelectedValue] = useState(1);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [productos,setProductos] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3080/admin/productos",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setProductos(data);
            console.log(searchQuery);
        };
        fetchData();
      }, []);
      
    return(
        <>
            <Header2/>
            <Box
                sx={{
                    display : 'flex',
                    justifyContent : 'flex-end',
                    mx : 5,
                    alignItems : 'center'
                }}
            >
                <Typography variant="h6" fontWeight="bold" sx={{mr : 2}}>Ordenar Por:</Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    onChange={handleChange}
                    sx={{
                        width : '10vw'
                    }}
                >
                    <MenuItem value={1}>Precio</MenuItem>
                    <MenuItem value={2}>Nombre</MenuItem>
                </Select>
                
            </Box>
            <Box
                sx={{
                    width: '95.5%',
                    minHeight: '4vh',
                    display : 'flex',
                    alignItems : 'center',
                    border: '2px solid gray',
                    backgroundColor : 'lightgray',
                    mx : 5,
                    mt : 2
                }}
            >
                <Typography variant="h5">
                    Resultados de busqueda
                </Typography>
            </Box>

            <Box
                sx={{
                    mx : 5,
                    mt : 2
                }}
            >
                {productos.filter(productos => productos.nombre === searchQuery || productos.serie === searchQuery || productos.marca === searchQuery || productos.tipo === searchQuery).map(productos => (
                    <ListaItemCarr
                        imagen = {productos.imagen}
                        nombre = {productos.nombre}
                        serie = {productos.serie}
                        fabricante= {productos.marca}
                        precio = {productos.precio}
                    />
                ))};
            </Box>
            <Box
                sx={{
                    display : "flex",
                    justifyContent : "flex-end",
                    mx : 5,
                    mt : 50
                }}
            >
                <Stack spacing={2}>
                    <Pagination count={10} shape="rounded"/>
                </Stack>
            </Box>
            <Footer/>
        </>
    );
}
export default Busqueda;