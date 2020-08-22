import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import IconButton from '@material-ui/core/IconButton';

export default function ButtonAppBar({
  setMode,
}) {
  console.log(setMode);
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton color="default" onClick={setMode}>
            <Brightness4Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
