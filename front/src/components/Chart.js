import React from 'react';
import { TypeChooser } from 'react-stockcharts/lib/helper';
import CandleChart from './CandleChart';
import getData from '../utils';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tmp_trade: '',
      tmp_day: '',
      data: null,
    };
  }

  componentDidUpdate() {
    if (this.props.trade !== this.state.tmp_trade || this.props.day !== this.state.tmp_day) {
      this.setState({ tmp_trade: this.props.trade }, () => {
        this.setState({ tmp_day: this.props.day }, () => {
          getData(this.state.tmp_trade, this.state.tmp_day).then((data) => {
            this.setState({ data });
          });
        });
      });
    }
  }

  render() {
    if (this.state.data === null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => (
          <CandleChart
            type={type}
            data={this.state.data}
            Boll={this.props.bollinger}
            EMA_20={this.props.ema_20}
            SMA_20={this.props.sma_20}
            EMA_50={this.props.ema_50}
            VOLUME={this.props.volume}
          />
        )}
      </TypeChooser>
    );
  }
}

export default Chart;
