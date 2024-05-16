import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function TitleBar({title}) {
  return (
    <Box
      sx={{
        bgcolor: '#D9D9D9',
        width: '77vw',
        height: '45px',
      }}
    >
      <Typography variant="body1" component="p" fontWeight="bold" padding='10px'>
        {title}
      </Typography>
    </Box>
  );
}

export default TitleBar;