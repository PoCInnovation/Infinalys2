import React from 'react';
import clsx from 'clsx';
import Chart from './Chart_candle';
import { getData } from "./utils"
import { TypeChooser } from "react-stockcharts/lib/helper";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { purple } from '@material-ui/core/colors';

import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";


class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tmp_trade: "",
      tmp_day: "",
      data: null
    }
  }
  componentDidUpdate() {
    if (this.props.trade !== this.state.tmp_trade || this.props.day !== this.state.tmp_day) {
      this.setState({tmp_trade: this.props.trade}, () => {
        this.setState({tmp_day: this.props.day}, () => {
          getData(this.state.tmp_trade, this.state.tmp_day).then(data => {
            this.setState({ data })
          })
        })
      });

    }
  }

	render() {
		if (this.state.data === null) {
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
        VOLUME={this.props.volume}
        />}
			</TypeChooser>
		)
	}
}


const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.primary.contrastText
  },
  fixedHeight: {
    height: 400,
  },
}));


class BOURSSE extends React.Component {
  render() {
    return (
      <ListItem button selected={this.props.Selected} onClick={this.props.Handle}>
        <ListItemIcon>
          <ShowChartIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.Label} />
        <ButtonGroup variant="contained" color="primary">
          <Button onClick={this.props.DAY1}>1D</Button>
          <Button onClick={this.props.DAY2}>1W</Button>
          <Button onClick={this.props.DAY3}>1M</Button>
        </ButtonGroup>
      </ListItem>
    );
  }
}
class CHECKBOX extends React.Component {
  render() {
    return(
      <FormControlLabel control={<Checkbox checked={this.props.Status} onChange={this.props.Func} name={this.props.Name} color={"primary"}/>}
        label={this.props.Label}
      />
    );
  }
}


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


  const [daytime, setdaytime] = React.useState("1d");
  const [boursse, setbourse] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  


  const handleListItemClick = (index, index_boursse) => {
    setbourse(index_boursse)
    setSelectedIndex(index)
  };
  
    return(
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
              <Paper className={fixedHeightPaper} elevation={4} >
                <List>
                  <ListItem>
                    <CHECKBOX Status={state.Boll} Func={handleChange} Name={"Boll"} Label={"bollinger"}/>
                    <CHECKBOX Status={state.Volume} Func={handleChange} Name={"Volume"} Label={"Volume"}/>
                    <CHECKBOX Status={state.sma_20} Func={handleChange} Name={"sma_20"} Label={"sma20"}/>
                  </ListItem>
                  <ListItem>
                  <CHECKBOX Status={state.ema_20} Func={handleChange} Name={"ema_20"} Label={"ema20"}/>
                  <CHECKBOX Status={state.ema_50} Func={handleChange} Name={"ema_50"} Label={"ema50"}/>
                  </ListItem>
                </List>
              </Paper>
              </Grid>
              <Grid item xs>
              <Paper className={fixedHeightPaper} elevation={4}>
                <List>
                  {/* <BOURSSE Selected={selectedIndex === 0} Handle={handleListItemClick(0, "GOOGL")} Label="Google" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/> */}
                  {/* <BOURSSE Selected={selectedIndex === 1} Handle={handleListItemClick(1, "SBUX")} Label="Starbux" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/>
                  <BOURSSE Selected={selectedIndex === 2} Handle={handleListItemClick(2, "AMZN")} Label="Amazon" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/>
                  <BOURSSE Selected={selectedIndex === 3} Handle={handleListItemClick(3, "^FCHI")} Label="CAC 40" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/>
                  <BOURSSE Selected={selectedIndex === 4} Handle={handleListItemClick(4, "FB")} Label="Facebook" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/>
                  <BOURSSE Selected={selectedIndex === 5} Handle={handleListItemClick(5, "GOLD")} Label="Amazon" DAY1={setdaytime("1d")} DAY2={setdaytime("1wk")} DAY3={setdaytime("1mo")}/> */}
                  <ListItem button selected={selectedIndex === 5} onClick={(event) => handleListItemClick(event, 5, "GOLD")}>
                    <ListItemIcon>
                      <ShowChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Or" />
                    <ButtonGroup variant="contained" color="primary">
                      <Button onClick={() => {setdaytime("1d")}}>1D</Button>
                      <Button onClick={() => {setdaytime("1wk")}}>1W</Button>
                      <Button onClick={() => {setdaytime("1mo")}}>1M</Button>
                    </ButtonGroup>
                  </ListItem>
                </List>
                </Paper>
              </Grid>
            </Grid>
        </MuiThemeProvider>
        </div>
    );
}

export default App;
