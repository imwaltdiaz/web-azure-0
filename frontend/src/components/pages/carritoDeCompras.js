import Typography from '@mui/material/Typography';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Footer from '../common/footer';
import Header2 from '../user/headerU';
import ListaItemCarr, { ListaSavedICar } from '../common/ObjCarrito';

export default function ItemsCarro() {
  const [items, setItems] = React.useState([
    {
      imagen: 'https://electroluxpe.vtexassets.com/arquivos/ids/159279/Blender_EBS20_Perspective_Electrolux_1000x1000.jpg?v=637888545873470000',
      nombre: 'nombre1',
      cant: 'cant',
      prize: 'prize',
      subtot: 'ubtot',
    },
    {
      imagen: 'https://falabella.scene7.com/is/image/FalabellaPE/gsc_115244582_1055792_1?wid=1500&hei=1500&qlt=70',
      nombre: 'nombre2',
      cant: 'cant',
      prize: 'prize',
      subtot: 'ubtot',
    },
  ]);

  const [savedItems, setSavedItems] = React.useState([]);

  const handleSaveForLater = (item) => {
    setSavedItems((prevItems) => [...prevItems, item]);
    setItems((prevItems) => prevItems.filter((i) => i!== item));
  };

  const handleRemoveItem = (item) => {
    setItems(items.filter((i) => i!== item));
    setSavedItems(savedItems.filter((i) => i!== item));
  };

  const handleMoveItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
    setSavedItems((prevSavedItems) => prevSavedItems.filter((i) => i!== item));
  };

  return (
    <>
      <Header2 />
      <Typography variant="h4" component="p">
        Items en tu Carrito de Compras
      </Typography>
      <Box component="section" sx={{ p: 2, border: '1px solid black', background: '#C2C1C1' }}>
        Items Disponible para Envio
      </Box>
      {items.map((item, index) => (
        <ListaItemCarr
          key={index}
          imagen={item.imagen}
          nombre={item.nombre}
          cant={item.cant}
          prize={item.prize}
          subtot={item.subtot}
          onSaveForLater={() => handleSaveForLater(item)}
          onRemoveItem={() => handleRemoveItem(item)}
        />
      ))}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '50px', marginBottom: '20px' }}>
        <Typography variant="h5" component="p" alignItems={"flex-end"}>
          Total: S/ 100
        </Typography>
        <Button href="/checkout" sx={{ border: '2px solid', backgroundColor: 'lightgrey' }}>
          Checkout
        </Button>
      </Box>
      <Box component="section" sx={{ p: 1, border: '1px solid black', background: '#C2C1C1', marginTop: '20px' }}>
        Guardado para después
      </Box>
      {savedItems.map((item, index) => (
        <ListaSavedICar
          key={index}
          imagen={item.imagen}
          nombre={item.nombre}
          cant={item.cant}
          prize={item.prize}
          subtot={item.subtot}
          onMoveToCart={() => handleMoveItem(item)}
          onRemoveItem={() => handleRemoveItem(item)}
        />
      ))}
      <Footer />
    </>
  );
}