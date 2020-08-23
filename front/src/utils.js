import { tsvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';

const parseDate = timeParse('%Y-%m-%d');

function parseData(d) {
  return {
    date: parseDate(d.Date),
    open: d.Open,
    high: d.High,
    low: d.Low,
    close: d.Close,
    volume: d.Volume,
  };
}

// https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv
// http://0.0.0.0:5000/?stock=AAPL&interval=3mo

export default function getData(trade, day) {
  const promiseMSFT = fetch(`http://0.0.0.0:5000/?stock=${trade}&interval=${day}`)
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData()));
  return promiseMSFT;
}
