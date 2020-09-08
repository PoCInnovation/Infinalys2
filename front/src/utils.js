import { tsvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';

const parseDate = timeParse('%Y-%m-%d');

function parseData(parse) {
  return function (d) {
    d.date = parseDate(d.Date);
    // var curentday = new Date()
    // if (curentday < d.date) {
    // 	console.log(curentday)
    // 	console.log(d.date)
    // }
    d.open = +d.Open;
    d.high = +d.High;
    d.low = +d.Low;
    d.close = +d.Close;
    d.volume = +d.Volume;
    // if (d.volume === 0) {
    //   console.log(d);
    // }
    return d;
  };
}

// https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv
// http://0.0.0.0:5000/?stock=AAPL&interval=3mo

export default function getData(trade, day) {
  const promiseMSFT = fetch(`http://${process.env.NODE_ENV === 'production' ? 'back' : '0.0.0.0'}:5000/?stock=${trade}&interval=${day}`)
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData(parseDate)));
  return promiseMSFT;
}
