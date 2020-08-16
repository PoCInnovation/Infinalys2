import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from './components/Checkbox';
import ChartComponent from './components/Chart';
import StockExchange from './components/StockExchange';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));

function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scope, setScope] = useState('1d');
  const [trade, setTrade] = useState('');
  const [state, setState] = useState({
    boll: false,
    volume: false,
    ema_20: false,
    sma_20: false,
    ema_50: false,
  });
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleListItemClick = (index, indexStock) => {
    setTrade(indexStock);
    setSelectedIndex(index);
  };

  const stockData = [
    { index: 'GOOGL', label: 'Google' },
    { index: 'SBUX', label: 'Starbucks' },
    { index: 'AMZN', label: 'Amazon' },
    { index: '^FCHI', label: 'CAC 40' },
    { index: 'FB', label: 'Facebook' },
    { index: 'GOLD', label: 'Or' },
  ];

  return (
    <div>
      <MuiThemeProvider theme={isLightTheme ? themeLight : themeDark}>
        <CssBaseline />
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ChartComponent
              bollinger={state.boll}
              volume={state.volume}
              ema_20={state.ema_20}
              ema_50={state.ema_50}
              sma_20={state.sma_20}
              trade={trade}
              day={scope}
            />
          </Grid>
          <Grid item xs>
            <Paper className={fixedHeightPaper} elevation={4} theme={light ? themeLight : themeDark}>
              <List>
                <ListItem>
                  <Checkbox status={state.boll} effect={handleChange} name="boll" label="Bollinger" />
                  <Checkbox status={state.volume} effect={handleChange} name="volume" label="Volume" />
                  <Checkbox status={state.sma_20} effect={handleChange} name="sma_20" label="sma20" />
                </ListItem>
                <ListItem>
                  <Checkbox status={state.ema_20} effect={handleChange} name="ema_20" label="ema20" />
                  <Checkbox status={state.ema_50} effect={handleChange} name="ema_50" label="ema50" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={fixedHeightPaper} elevation={4} theme={light ? themeLight : themeDark}>
              <List>
                {
                  stockData.map((stock, index) => (
                    <StockExchange
                      selected={selectedIndex === index}
                      handle={() => handleListItemClick(index, stock.index)}
                      label={stock.label}
                      scope={setScope}
                    />
                  ))
                }
              </List>
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
