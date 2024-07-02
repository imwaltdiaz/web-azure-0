import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';

function Header() {
  return (
    <AppBar position="static"
      sx = {{
        color: '#fff',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <Button href='/' variant='h1' sx={{fontWeight: 'bold' , fontSize: '20px', justifyContent: 'flex-start'}}>
      TIENDA
      </Button>
      
    </AppBar>
  
  )
}
export default Header;

