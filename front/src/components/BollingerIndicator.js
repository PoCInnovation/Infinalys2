import React from 'react';
import { BollingerBandTooltip } from 'react-stockcharts/lib/tooltip';
import { BollingerSeries } from 'react-stockcharts/lib/series';
import { bollingerBand } from 'react-stockcharts/lib/indicator';

const bbStroke = {
  top: '#964B00',
  middle: '#000000',
  bottom: '#964B00',
};

const bbFill = '#4682B4';

export default function bollinger(Data, Boolboll) {
  const bb = bollingerBand()
    .merge((d, c) => { d.bb = c; })
    .accessor((d) => d.bb);

  bb(Data);
  if (Boolboll) {
    return (
      <>
        <BollingerSeries yAccessor={(d) => d.bb} stroke={bbStroke} fill={bbFill} />
        <BollingerBandTooltip
          origin={[-38, 60]}
          yAccessor={(d) => d.bb}
          options={bb.options()}
        />
      </>
    );
  }
  return (
    <div />
  );
}
