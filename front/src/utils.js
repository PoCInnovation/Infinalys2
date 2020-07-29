import { tsvParse} from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	console.log(parse)
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		console.log(d)
		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

//https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv 
//http://0.0.0.0:5000/?stock=AAPL&interval=3mo

export function getData() {
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
		console.log(promiseMSFT)
	return promiseMSFT;
}
