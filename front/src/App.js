import React from 'react';
import Chart from './Chart_candle';
import { getData } from "./utils"
import { TypeChooser } from "react-stockcharts/lib/helper";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Grid from '@material-ui/core/Grid';



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
      data: null
    }
  }
  componentDidUpdate() {
    if (this.props.trade !== this.state.tmp_trade) {
      this.setState({tmp_trade: this.props.trade}, function () {
        getData(this.state.tmp_trade).then(data => {
          this.setState({ data })
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
        />}
			</TypeChooser>
		)
	}
}


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
  const [selectedIndex, setSelectedIndex] = React.useState(0);

    return(
      <div>
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
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="APPL" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1, "TESLA")}
                >
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="TESLA" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2, "TEST")}
                >
                  <ListItemIcon>
                    <ShowChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="TEST" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
      </div>
    );
}

export default App;
