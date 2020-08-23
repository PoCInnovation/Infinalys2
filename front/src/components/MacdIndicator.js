import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { Chart } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import {
  MACDTooltip,
} from 'react-stockcharts/lib/tooltip';
import {
  MACDSeries,
} from 'react-stockcharts/lib/series';
import { macd } from 'react-stockcharts/lib/indicator';

const macdAppearance = {
  stroke: {
    macd: '#FF0000',
    signal: '#00F300',
  },
  fill: {
    divergence: '#4682B4',
  },
};

const mouseEdgeAppearance = {
  textFill: '#542605',
  stroke: '#05233B',
  strokeOpacity: 1,
  strokeWidth: 3,
  arrowWidth: 5,
  fill: '#BCDEFA',
};

export default function MacdIndicator(data, BollMacd, id, length) {
  const macdCalculator = macd()
    .options({
      fast: 12,
      slow: 26,
      signal: 9,
    })
    .merge((d, c) => { d.macd = c; })
    .accessor((d) => d.macd);
  macdCalculator(data);

  if (BollMacd) {
    return (
      <Chart
        id={id}
        height={200}
        yExtents={macdCalculator.accessor()}
        origin={(w, h) => [0, h - (200 - length)]}
        padding={{ top: 10, bottom: 10 }}
      >
        <XAxis axisAt="bottom" orient="bottom" />
        <YAxis axisAt="right" orient="right" ticks={2} />

        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat('%Y-%m-%d')}
          rectRadius={5}
          {...mouseEdgeAppearance}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format('.2f')}
          {...mouseEdgeAppearance}
        />

        <MACDSeries
          yAccessor={(d) => d.macd}
          {...macdAppearance}
        />
        <MACDTooltip
          origin={[-38, 15]}
          yAccessor={(d) => d.macd}
          options={macdCalculator.options()}
          appearance={macdAppearance}
        />
      </Chart>
    );
  }
  return (
    <div />
  );
}
