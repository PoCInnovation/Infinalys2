import React from 'react';

import { MovingAverageTooltip } from 'react-stockcharts/lib/tooltip';
import { CurrentCoordinate } from 'react-stockcharts/lib/coordinates';
import {
  LineSeries,
} from 'react-stockcharts/lib/series';

import {
  ema, sma,
} from 'react-stockcharts/lib/indicator';

export function Ema20(Data, BoolEma) {
  const ema20 = ema()
    .options({
      windowSize: 20,
      sourcePath: 'close',
    })
    .skipUndefined(true)
    .merge((d, c) => { d.ema20 = c; })
    .accessor((d) => d.ema20);

  ema20(Data);
  if (BoolEma) {
    return (
      <>
        <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
        <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
        <MovingAverageTooltip
          origin={[-38, 15]}
          options={[{
            yAccessor: ema20.accessor(),
            type: ema20.type(),
            stroke: ema20.stroke(),
            windowSize: ema20.options().windowSize,
          }]}
        />
      </>
    );
  }
  return (
    <div />
  );
}

export function Ema50(Data, BoolEma) {
  const ema50 = ema()
    .options({
      windowSize: 50,
      sourcePath: 'close',
    })
    .skipUndefined(true)
    .merge((d, c) => { d.ema50 = c; })
    .accessor((d) => d.ema50);

  ema50(Data);
  if (BoolEma) {
    return (
      <>
        <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
        <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
        <MovingAverageTooltip
          origin={[20, 15]}
          options={[{
            yAccessor: ema50.accessor(),
            type: ema50.type(),
            stroke: ema50.stroke(),
            windowSize: ema50.options().windowSize,
          }]}
        />
      </>
    );
  }
  return (
    <div />
  );
}

export function Sma20(Data, BoolSma) {
  const sma20 = sma()
    .options({ windowSize: 20 })
    .merge((d, c) => { d.sma20 = c; })
    .accessor((d) => d.sma20);

  sma20(Data);
  if (BoolSma) {
    return (
      <>
        <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
        <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
        <MovingAverageTooltip
          origin={[75, 15]}
          options={[{
            yAccessor: sma20.accessor(),
            type: sma20.type(),
            stroke: sma20.stroke(),
            windowSize: sma20.options().windowSize,
          }]}
        />
      </>
    );
  }
  return (
    <div />
  );
}
