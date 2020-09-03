import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import CrossHairCursor from 'react-stockcharts/lib/coordinates/CrossHairCursor';
import bollinger from './BollingerIndicator';
import { Ema20, Ema50, Sma20 } from './EmaIndicator';
import Volume from './VolumeChart';
import Macd from './MacdIndicator';
import Rsi from './RsiIndicator';

function loadDataVolume(data) {
  let tab = [];
  const newDate = new Date();

  for (let index = 0; index < data.length; index += 1) {
    if (data[index].date > newDate) {
      const element = data[index];
      tab = tab.concat(element);
    }
  }
  return tab;
}

function SetupLengt(value) {
  let length = 0;
  let tmp = value;

  while (tmp !== 1) {
    length += 200;
    tmp -= 1;
  }
  return length;
}

function SetupMaxId(tab) {
  let value = 0;

  for (let index = 0; index < tab.length; index += 1) {
    if (tab[index]) {
      value += 1;
    }
  }
  // console.log('MAXID');
  // console.log(value);
  return value;
}

class CandleStickChartWithBollingerBandOverlay extends React.Component {
  render() {
    const {
      type, data: initialData, width, ratio, Boll, EMA_20, EMA_50, SMA_20, VOLUME, MACD, RSI,
    } = this.props;

    const calculatedData = initialData;
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date);
    const {
      data, xScale, xAccessor, displayXAccessor,
    } = xScaleProvider(calculatedData);

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];
    let maxid = SetupMaxId([true, VOLUME, MACD, RSI]);
    let length = SetupLengt(maxid);

    function ReturnId(boolean) {
      if (boolean) {
        const value = maxid;
        maxid -= 1;
        // console.log('return ID');
        // console.log(value);
        return value;
      }
    }

    function GradualLength(bolean) {
      if (bolean) {
        // console.log('before');
        // console.log(length);
        length -= 200;
        const value = length;
        // console.log('after');
        // console.log(length);
        // console.log('value');
        // console.log(value);
        return value;
      }
    }

    return (
      <ChartCanvas
        height={400 + length}
        width={width}
        ratio={ratio}
        margin={{
          left: 70, right: 70, top: 10, bottom: 30,
        }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={ReturnId(true)}
          height={300}
          yExtents={[(d) => [d.high, d.low]]}
        >
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />
          <OHLCTooltip origin={[-40, 0]} />
          <CandlestickSeries fill={(d, tmp_value = loadDataVolume(data)) => {
            for (let index = 0; index < tmp_value.length; index += 1) {
              const elem = tmp_value[index];
              if (elem.open === d.open && elem.close === d.close && elem.high === d.high && elem.low === d.low) {
                if (elem.open < elem.close) {
                  return 'rgb(255, 127, 0)';
                }
                return 'rgb(255,255,0)';
              }
            }
            if (d.close > d.open) {
              return 'rgb(0,166,81)';
            }
            return 'rgb(204,36,36)';
          }}
          />
          {Ema20(initialData, EMA_20)}
          {Ema50(initialData, EMA_50)}
          {Sma20(initialData, SMA_20)}
          {bollinger(initialData, Boll)}
        </Chart>
        {Volume(VOLUME, ReturnId(VOLUME), GradualLength(VOLUME))}
        {Macd(initialData, MACD, ReturnId(MACD), GradualLength(MACD))}
        {Rsi(initialData, RSI, ReturnId(RSI), GradualLength(RSI))}
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

CandleStickChartWithBollingerBandOverlay.propTypes = {
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

CandleStickChartWithBollingerBandOverlay = fitWidth(CandleStickChartWithBollingerBandOverlay);

export default CandleStickChartWithBollingerBandOverlay;
