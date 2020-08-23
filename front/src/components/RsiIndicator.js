import React from 'react';
import { format } from 'd3-format';
import { Chart } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import { RSITooltip } from 'react-stockcharts/lib/tooltip';
import { RSISeries } from 'react-stockcharts/lib/series';
import { rsi } from 'react-stockcharts/lib/indicator';

export default function RSIIndicator(data, BoolRSI, id, length) {
  const rsiCalculator = rsi()
    .options({ windowSize: 14 })
    .merge((d, c) => { d.rsi = c; })
    .accessor((d) => d.rsi);

  rsiCalculator(data);
  if (BoolRSI) {
    return (
      <Chart
        id={id}
        yExtents={[0, 100]}
        height={200}
        origin={(w, h) => [0, h - (200 + length)]}
      >
        <XAxis axisAt="bottom" orient="bottom" showTicks outerTickSize={0} />
        <YAxis
          axisAt="right"
          orient="right"
          tickValues={[30, 50, 70]}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format('.2f')}
        />
        <RSISeries yAccessor={(d) => d.rsi} />
        <RSITooltip
          origin={[-38, 15]}
          yAccessor={(d) => d.rsi}
          options={rsiCalculator.options()}
        />
      </Chart>
    );
  }
  return (
    <div />
  );
}
