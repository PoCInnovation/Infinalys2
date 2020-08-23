import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { Chart } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import { BarSeries } from 'react-stockcharts/lib/series';

export default function Volume(BoolVolume, id, length) {
  if (BoolVolume) {
    return (
      <Chart
        id={id}
        origin={(w, h) => [0, h - (200 + length)]}
        height={200}
        yExtents={(d) => d.volume}
      >
        <XAxis axisAt="bottom" orient="bottom" />
        <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('.2s')} />
        <BarSeries yAccessor={(d) => d.volume} fill={(d) => (d.close > d.open ? '#6BA583' : 'red')} />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat('%Y-%m-%d')}
        />
        <MouseCoordinateY
          at="left"
          orient="right"
          displayFormat={format('.2s')}
        />
      </Chart>
    );
  }
  return (
    <div />
  );
}
