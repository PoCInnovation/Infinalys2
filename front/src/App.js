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
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
    console.log(this.props.bolinger)
    console.log(this.props.trade)
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} Boll={this.props.bolinger}/>}
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
    checkedB: false,
    checkedF: false,
    checkedG: false,
  });

  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  
  const handleListItemClick = (event, index, index_boursse) => {
    setSelectedIndex(index);
    setbourse(index_boursse)
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
          <ChartComponent bolinger={state.Boll} trade={boursse}/>
          <Grid container spacing={3}>
            <Grid item xs>
              <List>
                <ListItem>
                  <FormControlLabel control={<Checkbox checked={state.Boll} onChange={handleChange} name="Boll" color={"primary"}/>}
                    label="Bolinger"
                  />
                  <FormControlLabel control={<Checkbox checked={state.checkedF} onChange={handleChange} name="checkedF" color={"primary"}/>}
                    label="label3"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" color={"primary"}/>}
                    label="label2"
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
              </List>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    );
}

export default App;
