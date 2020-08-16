import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function CheckboxFront(props) {
  return (
    <FormControlLabel
      control={<Checkbox checked={props.Status} onChange={props.Func} name={props.Name} color="primary" />}
      label={props.Label}
    />
  );
}

export default CheckboxFront;
