import React from 'react';
import Chart from './Chart_candle';
import { getData } from "./utils"
import { TypeChooser } from "react-stockcharts/lib/helper";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import ButtonAppBar from './AppBar'
// import AutoGrid from './Auto_grid'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

class ChartComponent extends React.Component {
	componentWillReceiveProps() {
    console.log("WILL UPDATE")
    console.log(this.props.trade);
      getData(this.props.trade).then(data => {
			this.setState({ data })
		})
  }

	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
        {type => <Chart 
        type={type} 
        data={this.state.data} 
        Boll={this.props.bolinger}
        EMA_20={this.props.ema_20}
        SMA_20={this.props.sma_20}
        EMA_50={this.props.ema_50}
        />}
			</TypeChooser>
		)
	}
}


const useStyles = makeStyles((theme) => ({
  
  root: {
    flexGrow: 1,
  },

  paper_css: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

}));


function App() {
  const [state, setState] = React.useState({
    Boll: false,
    ema_20: false,
    sma_20: false,
    ema_50: false,
  });

  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  
  const handleListItemClick = (event, index, index_boursse) => {
    setbourse(index_boursse)
    setSelectedIndex(index);
  };
  
  const [boursse, setbourse] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

    return(
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <ChartComponent bolinger={state.Boll} ema_20={state.ema_20} ema_50={state.ema_50} sma_20={state.sma_20} trade={boursse}/>
          <Grid container spacing={3}>
            <Grid item xs>
              <List>
                <ListItem>
                  <FormControlLabel control={<Checkbox checked={state.Boll} onChange={handleChange} name="Boll" color={"primary"}/>}
                    label="Bolinger"
                  />
                  <FormControlLabel control={<Checkbox checked={state.sma_20} onChange={handleChange} name="sma_20" color={"primary"}/>}
                    label="sma20"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel control={<Checkbox checked={state.ema_20} onChange={handleChange} name="ema_20" color={"primary"}/>}
                    label="ema20"
                  />
                  <FormControlLabel control={<Checkbox checked={state.ema_50} onChange={handleChange} name="ema_50" color={"primary"}/>}
                    label="ema50"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs>
              <List>
                <ListItem
                  button
                  selected={selectedIndex === 0}
                  onClick={(event) => handleListItemClick(event, 0, "APPL")}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="APPL" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1, "TESLA")}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="TESLA" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2, "TEST")}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="TEST" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    );
}

export default App;
