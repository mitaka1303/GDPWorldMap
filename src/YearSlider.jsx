import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function YearSlider(props) {
  return (
    <Box width={600}>
      <Slider defaultValue={2000} min={1960} max={2020} aria-label="Default" valueLabelDisplay="auto" onChange={(e)=>{props.changeYear(e.target.value)}}/>
    </Box>
  );
}