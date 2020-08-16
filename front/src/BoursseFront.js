import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShowChartIcon from '@material-ui/icons/ShowChart';

function BoursseFront(props) {
  return (
    <ListItem button selected={props.selected} onClick={props.Handle}>
      <ListItemIcon>
        <ShowChartIcon />
      </ListItemIcon>
      <ListItemText primary={props.Label} />
      <ButtonGroup variant="contained" color="primary">
        <Button onClick={() => { props.DAY('1d'); }}>1D</Button>
        <Button onClick={() => { props.DAY('1wk'); }}>1W</Button>
        <Button onClick={() => { props.DAY('1mo'); }}>1M</Button>
      </ButtonGroup>
    </ListItem>
  );
}

export default BoursseFront;
