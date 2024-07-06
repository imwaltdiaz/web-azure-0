import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {FormControl, FormLabel, Stack, Radio, RadioGroup, FormControlLabel,Box, Button, Typography} from '@mui/material';
export default function DetalleOrden(){
    const location = useLocation();
    const navigate = useNavigate(); 
    const { order } = location.state || {};
    const [id, setId] = useState(order?.id || '');
    const [direccion, setDireccion] = useState(order?.direccion || '');
    const [metPago, setMetPago] = useState(order?.metPago || '');
    const [nroTarjeta, setNroTarjeta] = useState(order?.nroTarjeta || '');
    const [cuentaTotal, setCuentaTotal] = useState(order?.cuentaTotal || '');
    const [envio, setEnvio] = useState(order?.envio || '');
    const [producto, setProducto] = useState(order?.Orden_Productos || []);
    const SubTotal = producto.reduce((acc, prod) => acc + prod.Producto.precio * prod.Producto.stock, 0);
    const Impuestos = 18;
    const Total = SubTotal + (envio === "Economico" ? 10 : 17) + Impuestos;
    const url1 = 'https://tienditadelabuelo.postgres.database.azure.com';
    const url2 = 'http://localhost:3080';

    function OfuscarNumero(number) {
        const numStr = number.toString();
        const length = numStr.length;
        
        if (length <= 4) {
            return numStr;
        }
        const censuradaParte = '*'.repeat(length - 4);
        const visibleParte = numStr.slice(-4);
        return censuradaParte + visibleParte;
    }
    const handleViewEliminar = (id) => {
        navigate('/admin/ordenes');
        async function deleteOrden() {
            try {
                const response = await fetch(url2 + '/admin/ordenes/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar la orden');
                }
            } catch (error) {
                console.error('Hubo un error al eliminar la orden', error);
            }
        }
        deleteOrden();
    }
    async function ActualizarTotal(){
        try {
            const response = await fetch(url2 + '/admin/ordenes/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cuentaTotal: Total
                })
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el total de la orden');
            }
        } catch (error) {
            console.error('Hubo un error al actualizar el total de la orden', error);
        }
    }
    ActualizarTotal();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "30px", justifyContent: "center"}}>
            <Stack direction="column" justifyContent="flex-start" paddingLeft="1vw">
                <Typography variant="h6" component="div" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
                    Detalles de Orden 
                </Typography>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: '#E7E3E3',
                    width: '77vw',
                    height: '4vh',
                    alignContent: 'center',
                    border: '1px grey solid',
                    paddingLeft: "1vw"

                }}><b>Datos de Compras</b></Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    width: '77vw'
                }}></Box>
                <Stack direction="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    paddingLeft: "2vw",
                    width: '36vw',
                    height: '20vh',
                    }}>
                        <p><b>Direccion de envio</b></p>
                        <p>{direccion}</p>
                    </Box>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    paddingLeft: "2vw",
                    width: '36vw',
                    height: '20vh',
                    alignContent: 'center'
                    }}>
                        <p><b>Pago</b></p>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group"
                                defaultValue={metPago}
                            >
                            <FormControlLabel value="QR" control={<Radio disabled />} label="Pago con QR" />
                            <FormControlLabel value="Tarjeta" control={<Radio disabled />} label="Pago con tarjeta de credito"/>
                            </RadioGroup>
                        </FormControl>
                    <Stack direction="row" justifyContent="space-between">
                        <p>Tarjeta de Credito que termina en: {OfuscarNumero(nroTarjeta)}</p>
                    </Stack>  
                    </Box>
                </Stack>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    width: '77vw'
                }}></Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: '#E7E3E3',
                    width: '77vw',
                    height: '4vh',
                    alignContent: 'center',
                    border: '1px grey solid',
                    paddingLeft: "1vw"

                }}><b>Metodos de Envio</b></Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    width: '77vw'
                }}></Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    paddingLeft: "2vw",
                    width: '76vw',
                    height: '5vh',
                    alignContent: 'center',
                }}>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group"
                            defaultValue={envio}
                        ><Stack direction="row">
                            <FormControlLabel value="Economico" control={<Radio disabled />} label="Economico Aereo - S/10" />
                            <FormControlLabel value="Prioritario" control={<Radio disabled />} label="Envio Prioritario (5 a 10 dias) - S/17"/>
                        </Stack></RadioGroup>
                    </FormControl>
                </Box>
                <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    width: '77vw'
                }}></Box>
                <Stack direction="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    paddingLeft: "2vw",
                    width: '36vw',
                    height: '25vh'
                    }}>
                        <p><b>Items en pedidos</b></p>
                        <ul>
                            {producto.map((prod) => (
                                <li key={prod.id}>{prod.Producto.stock}{" x "}{prod.Producto.detalle}</li>
                            ))}
                        </ul>
                    </Box>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    paddingLeft: "2vw",
                    width: '36vw',
                    height: '25vh'
                    }}>
                        <p><b>Resumen del pedido</b></p>
                        <p>SubTotal: S/{SubTotal}</p>
                        <p>Envio: S/{envio === "Economico" ? 10 : 17}</p>
                        <p>Impuestos: S/{Impuestos}</p>
                        <p>Total: S/{Total}</p>
                        <center><Button variant="contained" onClick={() => handleViewEliminar(id)}>Cancelar Pedido</Button></center>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}