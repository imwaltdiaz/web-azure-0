import Typography from '@mui/material/Typography';
import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/joy/Link';
import Footer from '../common/footer';
import Header from '../common/header';
import { Stack } from '@mui/material';
import SCollection from '../user/SCollection';




export default function TermPed(){
    return(
        <>
        <Header/>
        <Typography variant="h5" component="p" sx={{ textAlign: 'center' }}>   
        Muchas gracias por su pedido!
        </Typography>
        <br/>
        <br/>
        <br/>
        <Typography variant="body1" component="p" sx={{ textAlign: 'center' }}>   
        Puedes ver el detalle y estado de tu pedido ingresando a <Link href="/pantalla-principal">tu cuenta</Link>
        </Typography>

      <Typography variant="h5" component="p" pt={20}>   
        También te podría interesar...
      </Typography>
        <Box 
                //Items fila 1
                sx={{
                    px : 8,
                    pt : 6
                }}
            >
                <Stack
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
             >
                 <SCollection
                     txtL2="Item1"
                     hiperv="Learn More"
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStr7calOehHvhMaus6_ed7XUaiEG8scT4-d9SPI8Xq7Q&s"
                     width='150px'
                     height='200px'
                 />
                 <SCollection
                     txtL2="Item2"
                     hiperv="Learn More"
                     src="https://pbs.twimg.com/media/FircqQOXEAACPmx.jpg"
                     width='150px'
                     height='200px'
                 />
                 <SCollection
                     txtL2="Item3"
                     hiperv="Learn More"
                     src="https://realsportperu.com/wp-content/uploads/2021/08/NEGRO-TRIANGULO_1-scaled.jpg"
                     width='150px'
                     height='200px'
                 />
                 <SCollection
                     txtL2="Item4"
                     hiperv="Learn More"
                     src="https://promart.vteximg.com.br/arquivos/ids/6673886-1000-1000/1000240429.jpg?v=638083792851630000"
                     width='150px'
                     height='200px'
                 />
                 <SCollection
                     txtL2="Item5"
                     hiperv="Learn More"
                     src="https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaPE/19031549_1/w=1500,h=1500"
                     width='150px'
                     height='200px'
                 />
             </Stack>
            </Box>
            <Footer/>
        </>
    )
}