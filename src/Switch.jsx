import * as React from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function RelativeSwitch(props) {
  return (
    <FormGroup>
        <FormControlLabel control={<Switch/>}  onChange={(e)=>{props.changeSwitch(e.target.value)}} label = "relative"/>
    </FormGroup>
   
  );
}