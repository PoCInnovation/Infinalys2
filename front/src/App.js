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
      this.setState({tmp_trade: this.props.trade}, function () {
        this.setState({tmp_day: this.props.day}, function() {
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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
}));


function App() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [state, setState] = React.useState({
    Boll: false,
    ema_20: false,
    sma_20: false,
    ema_50: false,
    Volume: false,
  });
  
  const [daytime, setdaytime] = React.useState("");
  const [boursse, setbourse] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  
  const handleListItemClick = (event, index, index_boursse) => {
    setbourse(index_boursse)
    setSelectedIndex(index)
  };
  
    return(
      <div>
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
            <Paper className={fixedHeightPaper}>
              <List>
                <ListItem>
                  <FormControlLabel control={<Checkbox checked={state.Boll} onChange={handleChange} name="Boll" color={"primary"}/>}
                    label="Bolinger"
                  />
                  <FormControlLabel control={<Checkbox checked={state.Volume} onChange={handleChange} name="Volume" color={"primary"}/>}
                    label="Volume"
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
                <ListItem>
                  <Paper elevation={4}/>
                </ListItem>
              </List>
            </Paper>
            </Grid>
            <Grid item xs>
            <Paper className={fixedHeightPaper}>
              <List>
                <ListItem button selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, "GOOGL")}>
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="GOOGL" />
                  <ButtonGroup variant="contained" color="primary">
                    <Button onClick={() => {setdaytime("1d")}}>1D</Button>
                    <Button onClick={() => {setdaytime("1wk")}}>1W</Button>
                    <Button onClick={() => {setdaytime("1mo")}}>1M</Button>
                  </ButtonGroup>
                </ListItem>
                <ListItem button selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, "SBUX")}>
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="SBUX" />
                  <ButtonGroup variant="contained" color="primary">
                    <Button onClick={() => {setdaytime("1d")}}>1D</Button>
                    <Button onClick={() => {setdaytime("1wk")}}>1W</Button>
                    <Button onClick={() => {setdaytime("1mo")}}>1M</Button>
                  </ButtonGroup>
                </ListItem>
                <ListItem button selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 1, "AMZN")}>
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="AMZN" />
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
        </div>
    );
}

export default App;
