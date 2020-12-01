import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import IconButton from '@material-ui/core/IconButton';
import SimpleSelect from './OcurenceSelector';

export default function ButtonAppBar({
  setMode, setday, interval,
}) {
  // console.log(setMode);
  //<p style={{color : 'white', fontSize : 16, left : '170px'}}>Nombre de prédictions:</p>

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton color="default" onClick={setMode}>
            <Brightness4Icon />
          </IconButton>
          <p style={{color : 'white', fontSize : 16, marginLeft : '20px', marginRight : '-100px'}}>Nombre de prédictions:</p>
          <SimpleSelect setday={setday} nb_interval={interval} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
