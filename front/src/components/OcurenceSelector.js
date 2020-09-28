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
  setday, value,
}) {
  const classes = useStyles();

  const handleChange = (event) => {
    console.log(value);
    setday(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl} />
      <Select value={value} onChange={handleChange}>
        <MenuItem value="1">1d</MenuItem>
        <MenuItem value="2">2d</MenuItem>
        <MenuItem value="3">3d</MenuItem>
      </Select>
    </div>
  );
}
