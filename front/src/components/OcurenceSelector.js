import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({
  setday, nb_interval,
}) {
  const classes = useStyles();

  const handleChange = (event) => {
    setday(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl} />
      <Select value={nb_interval} onChange={handleChange}>
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
        <MenuItem value="3">3</MenuItem>
      </Select>
    </div>
  );
}
