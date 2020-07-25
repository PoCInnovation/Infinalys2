import React from 'react';
import Chart from './Chart_candle';
import { getData } from "./utils"
import { TypeChooser } from "react-stockcharts/lib/helper";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';



//MARK: this way is for chart component
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
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}


function App() {
  const [state, setState] = React.useState({
    Boll: false,
    Boll_up: false,
    Boll_down: false,
    Macd: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return(
    <div>
      <ChartComponent />

      <FormControlLabel
        control = {
          <Checkbox
            checked = {state.Boll}
            onChange = {handleChange}
            name = 'Boll'
            color = 'primary'
          />
        }
        label = "Boll"
      />
      <FormControlLabel
        control = {
          <Checkbox
            checked = {state.Boll_up}
            onChange = {handleChange}
            name = 'Boll_up'
            color = 'primary'
          />
        }
        label = "Boll_up"
      />
      <FormControlLabel
        control = {
          <Checkbox
            checked = {state.Boll_down}
            onChange = {handleChange}
            name = 'Boll_down'
            color = 'primary'
          />
        }
        label = "Boll_down"
      />
      <FormControlLabel
        control = {
          <Checkbox
            checked = {state.Macd}
            onChange = {handleChange}
            name = 'Macd'
            color = 'primary'
          />
        }
        label = "Macd"
      />
      
    </div>
  );
}

export default App;
