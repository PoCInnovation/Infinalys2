import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={5} dense>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

