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
    const [envio, setEnvio] = useState(order?.envio || []);
    const [producto, setProducto] = useState(order?.Productos || []);
    const SubTotal = producto.reduce((acc, prod) => acc + prod.precio * prod.stock, 0);
    const Impuestos = 18;
    const Total = SubTotal + (envio === "Economico" ? 10 : 17) + Impuestos;

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
                const response = await fetch('http://localhost:3080/admin/ordenes/' + id, {
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "30px"}}>
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
                    width: '38vw',
                    height: '20vh',

                    }}>
                        <p><b>Direccion de envio</b></p>
                        <p>{direccion}</p>
                    </Box>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    width: '38vw',
                    height: '20vh',
                    }}>
                        <p><b>Pago</b></p>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group"
                                defaultValue={metPago}
                            >
                            <FormControlLabel value="Qr" control={<Radio />} label="Pago con QR" />
                            <FormControlLabel value="Tarjeta" control={<Radio />} label="Pago con tarjeta de credito"/>
                            </RadioGroup>
                        </FormControl>
                    <Stack direction="row" justifyContent="space-between">
                        <p>Tarjeta de Credito que termina en:   </p>
                        <p>{OfuscarNumero(nroTarjeta)}</p>
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
                    width: '77vw',
                    height: '5vh',
                    paddingRight: "1vw",
                }}>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group"
                            defaultValue={envio}
                        ><Stack direction="row">
                            <FormControlLabel value="Economico" control={<Radio />} label="Economico Aereo - S/10" />
                            <FormControlLabel value="Prioritario" control={<Radio />} label="Envio Prioritario (5 a 10 dias) - S/17"/>
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
                    width: '38vw',
                    height: '25vh'
                    }}>
                        <p><b>Items en pedidos</b></p>
                        <ul>
                            {producto.map((prod) => (
                                <li>{prod.stock}{"x  "}{prod.detalle}</li>
                            ))} 
                        </ul>
                    </Box>
                    <Box sx={{
                    paddingBottom: "8px",
                    paddingTop: "8px",
                    backgroundColor: 'skyblue',
                    width: '38vw',
                    height: '25vh'
                    }}>
                        <p><b>Resumen del pedido</b></p>
                        <p>SubTotal: S/{SubTotal}</p>
                        <p>Envio: S/{envio === "Economico" ? 10 : 17}</p>
                        <p>Impuestos: S/{Impuestos}</p>
                        <p>Total: S/{cuentaTotal}</p>
                        <center><Button variant="contained" onClick={() => handleViewEliminar(id)}>Cancelar Pedido</Button></center>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}