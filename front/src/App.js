import React from 'react';
import clsx from 'clsx';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CssBaseline from '@material-ui/core/CssBaseline';

import CheckboxFront from './CheckboxFront';
import ChartComponent from './ChartComponent';
import BoursseFront from './BoursseFront';

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: '#e4f0e2',
    },
  },
});

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: '#222222',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.primary.contrastText,
  },
  fixedHeight: {
    height: 400,
  },
}));

function App() {
  const [light, setLight] = React.useState(false);
  const [state, setState] = React.useState({
    Boll: false,
    ema_20: false,
    sma_20: false,
    ema_50: false,
    Volume: false,
  });
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [daytime, setdaytime] = React.useState('1d');
  const [boursse, setbourse] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleListItemClick = (index, indexBoursse) => {
    setbourse(indexBoursse);
    setSelectedIndex(index);
  };

  return (
    <div>
      <MuiThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ChartComponent
              bolinger={state.Boll}
              volume={state.Volume}
              ema_20={state.ema_20}
              ema_50={state.ema_50}
              sma_20={state.sma_20}
              trade={boursse}
              day={daytime}
            />
          </Grid>
          <Grid item xs>
            <Paper className={fixedHeightPaper} elevation={4}>
              <List>
                <ListItem>
                  <CheckboxFront Status={state.Boll} Func={handleChange} Name="Boll" Label="bollinger" />
                  <CheckboxFront Status={state.Volume} Func={handleChange} Name="Volume" Label="Volume" />
                  <CheckboxFront Status={state.sma_20} Func={handleChange} Name="sma_20" Label="sma20" />
                </ListItem>
                <ListItem>
                  <CheckboxFront Status={state.ema_20} Func={handleChange} Name="ema_20" Label="ema20" />
                  <CheckboxFront Status={state.ema_50} Func={handleChange} Name="ema_50" Label="ema50" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={fixedHeightPaper} elevation={4}>
              <List>
                <BoursseFront Selected={selectedIndex === 0} Handle={() => handleListItemClick(0, 'GOOGL')} Label="Google" DAY={setdaytime} />
                <BoursseFront Selected={selectedIndex === 1} Handle={() => handleListItemClick(1, 'SBUX')} Label="Starbux" DAY={setdaytime} />
                <BoursseFront Selected={selectedIndex === 2} Handle={() => handleListItemClick(2, 'AMZN')} Label="Amazon" DAY={setdaytime} />
                <BoursseFront Selected={selectedIndex === 3} Handle={() => handleListItemClick(3, '^FCHI')} Label="CAC 40" DAY={setdaytime} />
                <BoursseFront Selected={selectedIndex === 4} Handle={() => handleListItemClick(4, 'FB')} Label="Facebook" DAY={setdaytime} />
                <BoursseFront Selected={selectedIndex === 5} Handle={() => handleListItemClick(5, 'GOLD')} Label="Or" DAY={setdaytime} />
              </List>
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
