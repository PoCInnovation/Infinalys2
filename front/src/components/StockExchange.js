import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShowChartIcon from '@material-ui/icons/ShowChart';

function StockExchange({
  selected, handle, label, scope,
}) {
  return (
    <ListItem button selected={selected} onClick={handle}>
      <ListItemIcon>
        <ShowChartIcon />
      </ListItemIcon>
      <ListItemText primary={label} />
      <ButtonGroup variant="contained" color="primary">
        <Button onClick={() => { scope('1d'); }}>1D</Button>
        <Button onClick={() => { scope('1wk'); }}>1W</Button>
        <Button onClick={() => { scope('1mo'); }}>1M</Button>
      </ButtonGroup>
    </ListItem>
  );
}

export default StockExchange;
