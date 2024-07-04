import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function SearchBar(){
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const searcher = (e) => {
        setSearchQuery(e.target.value);
        console.log(e.target.value);
    };

    const handleSearch = () => {
        navigate("/busqueda", { state: { searchQuery } });
    };

    return(
        <Box    
        sx={{
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'center',
                gap : 1,
                marginTop : 2,
            }}
        >
            <TextField
                id="busqueda"
                variant="outlined"
                placeholder="Buscar productos por nombre..."
                sx={{width : 2300}}
                value={searchQuery}
                onChange={searcher}
            />
            <Button variant="contained" onClick={handleSearch} sx={{backgroundColor : 'gray', color : 'white', width : '5%', height : '4vh'}}>Buscar</Button>
        </Box>
        
    );
}

export default SearchBar;