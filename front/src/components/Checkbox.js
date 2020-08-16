import React from 'react';
import MaterialCheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function Checkbox({
  status, effect, name, label,
}) {
  return (
    <FormControlLabel
      control={<MaterialCheckBox checked={status} onChange={effect} name={name} color="primary" />}
      label={label}
    />
  );
}

export default Checkbox;
