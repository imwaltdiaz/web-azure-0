import {AppBar, Button} from '@mui/material';
function Header_salir() {
  return (
    <AppBar position="static"
      sx = {{
        color: '#fff',
        padding: '20px',
        marginBottom: '20px',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: '7vh'
      }}
    >
        TIENDA
        <Button variant="Text" onClick={() => {window.location.href = 'http://localhost:3000';}}>Cerrar sesion</Button>
    </AppBar>
  )
}
export default Header_salir;