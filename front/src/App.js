import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  );
}

export default App;
